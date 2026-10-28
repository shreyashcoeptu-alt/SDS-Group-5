import os
from dotenv import load_dotenv
import pymongo

# Load environment variables from .env file
load_dotenv()

# Fetch MongoDB URI from .env
MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

if not MONGO_URI:
    print("❌ Error: MongoDB connection string not found in .env file!")
    exit(1)

try:
    # Connect to MongoDB Atlas (Standard Connection)
    client = pymongo.MongoClient(MONGO_URI)
    db = client["TheLunchroom"]  # Project database name
    
    # Collections for Cart & Order Placement feature
    cart_collection = db["carts"]
    orders_collection = db["orders"]

    # Sample Order document
    sample_order = {
        "student_name": "Shantanu Mahajan",
        "items": [
            {"item_name": "Poha", "quantity": 2, "price": 20.0},
            {"item_name": "Cold Coffee", "quantity": 1, "price": 35.0}
        ],
        "total_amount": 75.0,
        "status": "Pending",  # Statuses: Pending, Preparing, Ready, Completed
        "payment_status": "Unpaid"
    }

    # Insert sample order into Atlas Cloud Database
    result = orders_collection.insert_one(sample_order)
    print("✅ Connection successful!")
    print(f"📦 Sample order inserted with ID: {result.inserted_id}")

except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")