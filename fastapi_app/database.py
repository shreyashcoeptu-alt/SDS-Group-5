import os
from dotenv import load_dotenv
import pymongo

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("❌ MONGODB_URI missing in .env file!")

# Initialize single MongoDB Client instance
client = pymongo.MongoClient(MONGO_URI)

# Connect to shared database
db = client["TheLunchroom"]

# Collection handles matching team structure
cart_collection = db["carts"]
orders_collection = db["orders"]
food_collection = db["fooditems"]
