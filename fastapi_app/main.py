from fastapi import FastAPI

app = FastAPI(
    title="The Lunchroom - Cart & Orders API",
    description="Student 3 Backend Services",
    version="1.0.0",
)


@app.get("/")
def home():
    return {"status": "online", "message": "FastAPI Server for The Lunchroom is live!"}
