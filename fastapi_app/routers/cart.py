from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from fastapi_app.schemas import CartItemRequest, RemoveCartItemRequest
from fastapi_app.database import cart_collection, food_collection

router = APIRouter(prefix="/cart", tags=["Cart Operations"])


# 1. GET /cart/{user_id} - View User Cart
@router.get("/{user_id}")
def get_user_cart(user_id: str):
    cart = cart_collection.find_one({"user_id": user_id})

    if not cart:
        return {
            "user_id": user_id,
            "items": [],
            "total_price": 0.0,
            "message": "Cart is currently empty",
        }

    cart["_id"] = str(cart["_id"])
    return cart


# 2. POST /cart/add - Add Item to User Cart (Strict Validation against menuitems)
@router.post("/add")
def add_to_cart(item: CartItemRequest):
    # Lookup food item strictly from 'menuitems'
    try:
        food = food_collection.find_one({"_id": ObjectId(item.food_id)})
    except Exception:
        food = food_collection.find_one({"_id": item.food_id})

    # Strictly reject if food item does NOT exist in menuitems
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with ID '{item.food_id}' does not exist in menuitems.",
        )

    item_price = float(food.get("price", 0.0))
    item_name = food.get("name", "Unknown Item")

    # Fetch existing user cart document from 'carts'
    cart = cart_collection.find_one({"user_id": item.user_id})

    if not cart:
        # Create a brand-new CART document for this user in 'carts'
        new_cart = {
            "user_id": item.user_id,
            "items": [
                {
                    "food_id": item.food_id,
                    "name": item_name,
                    "price": item_price,
                    "quantity": item.quantity,
                    "subtotal": item_price * item.quantity,
                }
            ],
            "total_price": item_price * item.quantity,
        }
        cart_collection.insert_one(new_cart)
    else:
        # Update existing user CART document in 'carts'
        items = cart.get("items", [])
        found = False

        for cart_item in items:
            if cart_item["food_id"] == item.food_id:
                cart_item["quantity"] += item.quantity
                cart_item["subtotal"] = cart_item["quantity"] * cart_item["price"]
                found = True
                break

        if not found:
            items.append(
                {
                    "food_id": item.food_id,
                    "name": item_name,
                    "price": item_price,
                    "quantity": item.quantity,
                    "subtotal": item_price * item.quantity,
                }
            )

        new_total = sum(i["subtotal"] for i in items)
        cart_collection.update_one(
            {"user_id": item.user_id},
            {"$set": {"items": items, "total_price": new_total}},
        )

    return {
        "status": "success",
        "message": f"Added {item.quantity} x '{item_name}' (₹{item_price} each) to cart",
    }


# 3. DELETE /cart/clear/{user_id} - Empty User Cart
@router.delete("/clear/{user_id}")
def clear_cart(user_id: str):
    result = cart_collection.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        return {"status": "info", "message": "No cart found to clear"}
    return {"status": "success", "message": f"Cart cleared for user '{user_id}'"}
