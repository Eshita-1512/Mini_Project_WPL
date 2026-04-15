import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

from database import connect_db, disconnect_db
from routers import products, cart, orders, auth, admin

load_dotenv()


# ─── Lifespan (startup / shutdown) ───────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_db()
    yield
    disconnect_db()


# Create App

app = FastAPI(
    title="Gaura Backend API",
    description="Saree e-commerce backend powered by FastAPI",
    version="1.0.0",
    lifespan=lifespan,
)

# Middleware 

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "gaura_secret_key"),
    max_age=60 * 60 * 24,          
    same_site="lax",
    https_only=False,            
)

# CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers

app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(auth.router)
app.include_router(admin.router)


# Health Check

@app.get("/")
async def root():
    return {"message": "Gaura Backend API is running!"}
