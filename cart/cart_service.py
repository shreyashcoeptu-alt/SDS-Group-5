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