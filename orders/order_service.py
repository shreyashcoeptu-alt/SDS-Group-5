import sys
import os
from datetime import datetime, timezone

# Allow importing database.py and cart modules from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import cart_collection, orders_collection
from cart.cart_service import get_cart_summary

def place_order(user_id: str, payment_id: str = "PAY_MOCK_12345"):
    """
    Converts a user's active cart into a confirmed order,
    saves it to the orders collection, and empties the cart.
    """
    # 1. Fetch current cart items and total amount
    cart_summary = get_cart_summary(user_id)
    
    if not cart_summary["items"]:
        return {"success": False, "message": "Cannot place order with an empty cart."}

    # 2. Build standard Order document matching team schema
    new_order = {
        "userId": user_id,
        "items": cart_summary["items"],
        "totalAmount": cart_summary["totalAmount"],
        "status": "Pending",               # Pending -> Preparing -> Ready -> Completed
        "paymentStatus": "Paid",            # Updated upon payment processing
        "paymentId": payment_id,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }

    # 3. Insert order record into MongoDB orders collection
    result = orders_collection.insert_one(new_order)
    order_id = str(result.inserted_id)

    # 4. Clear the active cart in MongoDB
    cart_collection.delete_one({"userId": user_id})

    return {
        "success": True,
        "orderId": order_id,
        "totalAmount": cart_summary["totalAmount"],
        "message": "Order placed successfully!"
    }


def get_user_orders(user_id: str):
    """
    Retrieves order history for a specific student.
    """
    orders = list(orders_collection.find({"userId": user_id}, {"_id": 0}))
    return orders