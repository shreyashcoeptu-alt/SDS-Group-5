from fastapi import FastAPI
from fastapi_app.routers import cart

app = FastAPI(
    title="The Lunchroom - Cart & Orders API",
    description="Student 3 Backend Services",
    version="1.0.0",
)

# Attach the Cart router to the main application
app.include_router(cart.router)


@app.get("/")
def home():
    return {"status": "online", "message": "FastAPI Server for The Lunchroom is live!"}
