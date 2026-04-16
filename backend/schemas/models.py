from pydantic import BaseModel
from typing import List, Optional


# ─── Cart ────────────────────────────────────────────────────

class CartItemRequest(BaseModel):
    productId: int
    quantity: int


class UpdateCartRequest(BaseModel):
    quantity: int


# ─── Orders ──────────────────────────────────────────────────

class CartItem(BaseModel):
    productId: int
    quantity: int


class OrderRequest(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    pincode: str
    cart: List[CartItem]


class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ─── Auth ────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    city: str
    country: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ─── Admin ───────────────────────────────────────────────────

class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AddProductRequest(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category_id: Optional[int] = None


class EditProductRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_id: Optional[int] = None
