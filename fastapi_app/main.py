from fastapi import FastAPI
from fastapi_app.routers import cart, orders

app = FastAPI(
    title="The Lunchroom - Cart & Orders API",
    description="Student 3 Backend Services",
    version="1.0.0",
)

# Include both routers
app.include_router(cart.router)
app.include_router(orders.router)


@app.get("/")
def home():
    return {"status": "online", "message": "FastAPI Server for The Lunchroom is live!"}
