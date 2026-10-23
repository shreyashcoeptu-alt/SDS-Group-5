from pydantic import BaseModel, Field
from typing import Optional


# 1. Input schema when a user adds or updates an item in their cart
class CartItemRequest(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user")
    food_id: str = Field(..., description="Unique ID of the food item")
    quantity: int = Field(..., ge=1, description="Quantity to add (must be at least 1)")


# 2. Input schema when a user removes a specific item from their cart
class RemoveCartItemRequest(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user")
    food_id: str = Field(..., description="Unique ID of the food item to remove")


# 3. Input schema when a user converts their active cart into an order
class PlaceOrderRequest(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user placing the order")
    delivery_notes: Optional[str] = Field(
        None, description="Optional delivery or dietary notes"
    )
