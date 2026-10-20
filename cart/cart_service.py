import sys
import os

# Allow Python to import database.py from the root directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import cart_collection

def add_to_cart(user_id: str, food_item_id: str, item_name: str, price: float, quantity: int = 1):
    """
    Adds an item to the user's cart in MongoDB, or increments quantity if it exists.
    """
    # Look for an existing cart for this user
    user_cart = cart_collection.find_one({"userId": user_id})

    if not user_cart:
        # Create a new cart document
        new_cart = {
            "userId": user_id,
            "items": [
                {
                    "foodItemId": food_item_id,
                    "name": item_name,
                    "price": price,
                    "quantity": quantity
                }
            ]
        }
        cart_collection.insert_one(new_cart)
        return f"✅ Created new cart for {user_id} with {item_name}."

    # If cart already exists, update the items list
    items = user_cart.get("items", [])
    item_found = False

    for item in items:
        if item["foodItemId"] == food_item_id:
            item["quantity"] += quantity
            item_found = True
            break

    if not item_found:
        items.append({
            "foodItemId": food_item_id,
            "name": item_name,
            "price": price,
            "quantity": quantity
        })

    # Update document in MongoDB
    cart_collection.update_one(
        {"userId": user_id},
        {"$set": {"items": items}}
    )
    return f"✅ Updated cart for {user_id} with {item_name}."

def update_cart_quantity(user_id: str, food_item_id: str, new_quantity: int):
    """
    Updates the quantity of a specific item in the cart.
    If new_quantity is 0 or less, the item is removed from the cart.
    """
    if new_quantity <= 0:
        return remove_from_cart(user_id, food_item_id)

    user_cart = cart_collection.find_one({"userId": user_id})
    if not user_cart:
        return f"❌ Cart for {user_id} not found."

    items = user_cart.get("items", [])
    updated = False

    for item in items:
        if item["foodItemId"] == food_item_id:
            item["quantity"] = new_quantity
            updated = True
            break

    if updated:
        cart_collection.update_one(
            {"userId": user_id},
            {"$set": {"items": items}}
        )
        return f"✅ Updated quantity for item {food_item_id} to {new_quantity}."
    
    return f"❌ Item {food_item_id} not found in cart."


def remove_from_cart(user_id: str, food_item_id: str):
    """
    Removes an item completely from the user's cart using MongoDB's $pull operator.
    """
    user_cart = cart_collection.find_one({"userId": user_id})
    if not user_cart:
        return f"❌ Cart for {user_id} not found."

    # Use MongoDB's $pull operator to remove the item matching foodItemId directly
    result = cart_collection.update_one(
        {"userId": user_id},
        {"$pull": {"items": {"foodItemId": food_item_id}}}
    )

    if result.modified_count > 0:
        return f"✅ Removed item {food_item_id} from cart."
    
    return f"❌ Item {food_item_id} not found in cart."


