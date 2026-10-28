from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_app.routers import cart, orders

app = FastAPI(
    title="The Lunchroom - Cart & Orders API",
    description="Student 3 Backend Services for Cart & Order Placement",
    version="1.0.0",
)

# Enable CORS for local React/Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from all local frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Cart and Order routers
app.include_router(cart.router)
app.include_router(orders.router)


@app.get("/")
def home():
    return {"status": "online", "message": "FastAPI Server for The Lunchroom is live!"}
