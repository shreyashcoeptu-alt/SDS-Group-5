import random
from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from fastapi_app.database import cart_collection, orders_collection
from fastapi_app.schemas import PlaceOrderRequest

router = APIRouter(prefix="/orders", tags=["Order Operations"])


# Helper to generate order numbers matching Sherwin's format (e.g. ORD-618802-214)
def generate_order_number():
    part1 = random.randint(100000, 999999)
    part2 = random.randint(100, 999)
    return f"ORD-{part1}-{part2}"


# 1. POST /orders/place - Convert active cart into Sherwin-compatible Order document
@router.post("/place")
def place_order(request: PlaceOrderRequest):
    # Fetch active user cart
    cart = cart_collection.find_one({"user_id": request.user_id})

    if not cart or not cart.get("items"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot place an order with an empty cart.",
        )

    # Format items list to match Sherwin's 'menuItem' field
    formatted_items = []
    for item in cart["items"]:
        try:
            menu_item_ref = ObjectId(item["food_id"])
        except Exception:
            menu_item_ref = item["food_id"]

        formatted_items.append(
            {
                "menuItem": menu_item_ref,
                "name": item.get("name", "Food Item"),
                "price": item.get("price", 0.0),
                "quantity": item.get("quantity", 1),
                "subtotal": item.get("subtotal", 0.0),
            }
        )

    # Customer field reference
    try:
        customer_ref = ObjectId(request.user_id)
    except Exception:
        customer_ref = request.user_id

    # Construct Order document strictly following camelCase Mongoose schema
    new_order = {
        "orderNumber": generate_order_number(),
        "customer": customer_ref,
        "userId": request.user_id,
        "user_id": request.user_id,  # Included for backwards safety
        "items": formatted_items,
        "totalAmount": cart.get("total_price", 0.0),
        "status": "Pending",
        "paymentStatus": "Unpaid",
        "paymentId": "",
        "specialInstructions": request.delivery_notes or "",
        "createdAt": datetime.utcnow().isoformat(),
    }

    # Save to 'orders' collection
    result = orders_collection.insert_one(new_order)
    order_id = str(result.inserted_id)

    # Clear user's active cart after placing order
    cart_collection.delete_one({"user_id": request.user_id})

    return {
        "status": "success",
        "message": "Order placed successfully!",
        "order_id": order_id,
        "orderNumber": new_order["orderNumber"],
        "totalAmount": cart.get("total_price", 0.0),
    }


# 2. GET /orders/{user_id} - Retrieve order history for user
@router.get("/{user_id}")
def get_user_orders(user_id: str):
    query = {"$or": [{"userId": user_id}, {"user_id": user_id}, {"customer": user_id}]}
    user_orders = list(orders_collection.find(query))

    for order in user_orders:
        order["_id"] = str(order["_id"])
        if isinstance(order.get("customer"), ObjectId):
            order["customer"] = str(order["customer"])
        for item in order.get("items", []):
            if isinstance(item.get("menuItem"), ObjectId):
                item["menuItem"] = str(item["menuItem"])

    return {"user_id": user_id, "total_orders": len(user_orders), "orders": user_orders}
