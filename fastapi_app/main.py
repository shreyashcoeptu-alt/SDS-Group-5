from fastapi import FastAPI
from fastapi_app.schemas import CartItemRequest

app = FastAPI(
    title="The Lunchroom - Cart & Orders API",
    description="Student 3 Backend Services",
    version="1.0.0",
)


@app.get("/")
def home():
    return {"status": "online", "message": "FastAPI Server for The Lunchroom is live!"}


# Temporary route to test Pydantic validation
@app.post("/test-schema")
def test_cart_schema(item: CartItemRequest):
    return {"message": "Schema validation passed!", "received_data": item}
