from fastapi import APIRouter, Depends, Request, HTTPException

from database import get_db
from schemas.models import RegisterRequest, LoginRequest

router = APIRouter(prefix="/api/auth", tags=["Auth"])


# POST /api/auth/register — Register new user
@router.post("/register")
def register(request: Request, body: RegisterRequest, cur=Depends(get_db)):
    # Check if user already exists
    cur.execute("SELECT * FROM users WHERE email = %s", (body.email,))
    existing = cur.fetchone()
    if existing:
        raise HTTPException(status_code=409, detail="User with this email already exists")

    cur.execute(
        "INSERT INTO users (name, email, phone, city,country,password) VALUES (%s, %s, %s, %s,%s,%s) RETURNING user_id",
        (body.name, body.email, body.phone,body.city,body.country,body.password),
    )
    new_user = cur.fetchone()

    # Set user session
    user_data = {
        "userId": new_user["user_id"],
        "name": body.name,
        "email": body.email,
        "phone": body.phone,
        "city": body.city,
        "country": body.country,
    }
    request.session["user"] = user_data

    return {
        "success": True,
        "message": "User registered successfully",
        "user": user_data,
    }


# POST /api/auth/login — User login
@router.post("/login")
def login(request: Request, body: LoginRequest, cur=Depends(get_db)):
    cur.execute("SELECT * FROM users WHERE email = %s", (body.email,))
    row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Set user session
    user_data = {
        "userId": row["user_id"],
        "name": row["name"],
        "email": row["email"],
    }
    request.session["user"] = user_data

    return {"success": True, "message": "Logged in", "user": user_data}


# POST /api/auth/logout — User logout
@router.post("/logout")
def logout(request: Request):
    request.session.pop("user", None)
    return {"success": True, "message": "Logged out"}


# GET /api/auth/me — Get logged in user info
@router.get("/me")
def me(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    return {"success": True, "user": user}
