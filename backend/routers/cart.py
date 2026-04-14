from fastapi import APIRouter, Depends, Request, HTTPException

from database import get_db
from schemas.models import CartItemRequest, UpdateCartRequest

router = APIRouter(prefix="/api/cart", tags=["Cart"])


# GET /api/cart 
@router.get("/")
def get_cart(request: Request, cur=Depends(get_db)):
    cart = request.session.get("cart", [])

    if len(cart) == 0:
        return {"success": True, "cart": [], "total": 0}

    
    product_ids = [item["productId"] for item in cart]
    placeholders = ", ".join(["%s"] * len(product_ids))
    cur.execute(
        f"SELECT * FROM products WHERE product_id IN ({placeholders})",
        product_ids,
    )
    rows = cur.fetchall()

    cart_details = []
    for item in cart:
        product = next((r for r in rows if r["product_id"] == item["productId"]), None)
        if not product:
            continue

        discounted_price = round(float(product["original_price"]) * 0.75, 2)
        cart_details.append({
            "productId": item["productId"],
            "name": product["name"],
            "original_price": float(product["original_price"]),
            "discounted_price": discounted_price,
            "quantity": item["quantity"],
            "subtotal": round(discounted_price * item["quantity"], 2),
        })

    total = round(sum(item["subtotal"] for item in cart_details), 2)

    return {"success": True, "cart": cart_details, "total": total}


# POST /api/cart 
@router.post("/")
def add_to_cart(request: Request, body: CartItemRequest):
    if body.quantity < 1:
        raise HTTPException(status_code=400, detail="productId and quantity (>=1) are required")

    cart = request.session.get("cart", [])

    # Check if item already exists in cart
    existing = next((item for item in cart if item["productId"] == body.productId), None)

    if existing:
        existing["quantity"] += body.quantity
    else:
        cart.append({"productId": body.productId, "quantity": body.quantity})

    request.session["cart"] = cart

    return {"success": True, "message": "Item added to cart", "cart": cart}


# PUT /api/cart/{product_id} 
@router.put("/{product_id}")
def update_cart_item(request: Request, product_id: int, body: UpdateCartRequest):
    if body.quantity < 1:
        raise HTTPException(status_code=400, detail="quantity (>=1) is required")

    cart = request.session.get("cart", [])

    if not cart:
        raise HTTPException(status_code=404, detail="Cart is empty")

    item = next((i for i in cart if i["productId"] == product_id), None)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    item["quantity"] = body.quantity
    request.session["cart"] = cart

    return {"success": True, "message": "Cart updated", "cart": cart}


# DELETE /api/cart/{product_id} 
@router.delete("/{product_id}")
def remove_cart_item(request: Request, product_id: int):
    cart = request.session.get("cart", [])

    if not cart:
        raise HTTPException(status_code=404, detail="Cart is empty")

    request.session["cart"] = [item for item in cart if item["productId"] != product_id]

    return {"success": True, "message": "Item removed from cart", "cart": request.session["cart"]}


# DELETE /api/cart 
@router.delete("/")
def clear_cart(request: Request):
    request.session["cart"] = []
    return {"success": True, "message": "Cart cleared"}
