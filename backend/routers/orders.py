from fastapi import APIRouter, Depends, Request, HTTPException

from database import get_db
from schemas.models import OrderRequest

router = APIRouter(prefix="/api/orders", tags=["Orders"])


# POST /api/orders — Place a new order
@router.post("/")
def place_order(request: Request, body: OrderRequest, cur=Depends(get_db)):
    if len(body.cart) == 0:
        raise HTTPException(status_code=400, detail="All fields and at least one cart item are required")

    # Fetch product details for the cart items
    product_ids = [item.productId for item in body.cart]
    placeholders = ", ".join(["%s"] * len(product_ids))
    cur.execute(
        f"SELECT * FROM products WHERE product_id IN ({placeholders})",
        product_ids,
    )
    rows = cur.fetchall()

    # Calculate total with discounted prices
    subtotal = 0.0
    order_items = []
    for item in body.cart:
        product = next((r for r in rows if r["product_id"] == item.productId), None)
        if not product:
            continue

        discounted_price = round(float(product["original_price"]) * 0.75, 2)
        item_total = discounted_price * item.quantity
        subtotal += item_total

        order_items.append({
            "productId": item.productId,
            "quantity": item.quantity,
            "price": discounted_price,
        })

    # Shipping logic
    shipping = 199  # default domestic
    pincode_str = str(body.pincode)

    if pincode_str.startswith("400"):
        shipping = 0       # Mumbai — free shipping
    elif len(pincode_str) != 6:
        shipping = 999     # International (non-Indian pincode)

    total_amount = round(subtotal + shipping, 2)

    # Check if user exists, or create a guest user record
    cur.execute("SELECT user_id FROM users WHERE email = %s", (body.email,))
    existing_user = cur.fetchone()

    if existing_user:
        user_id = existing_user["user_id"]
    else:
        cur.execute(
            "INSERT INTO users (name, email, phone, city) VALUES (%s, %s, %s, %s) RETURNING user_id",
            (body.name, body.email, body.phone, body.city),
        )
        new_user = cur.fetchone()
        user_id = new_user["user_id"]

    # Insert into shipping_addresses table
    cur.execute(
        """INSERT INTO shipping_addresses (user_id, full_name, phone, address_line1, city, postal_code, country) 
           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING address_id""",
        (user_id, body.name, body.phone, body.address, body.city, body.pincode, "India" if shipping != 999 else "International"),
    )

    # Insert order
    cur.execute(
        "INSERT INTO orders (user_id, total_amount, shipping_charge, order_status) VALUES (%s, %s, %s, %s) RETURNING order_id",
        (user_id, total_amount, shipping, "Placed"),
    )
    new_order = cur.fetchone()
    order_id = new_order["order_id"]

    # Insert order items
    for item in order_items:
        cur.execute(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
            (order_id, item["productId"], item["quantity"], item["price"]),
        )

    # Clear session cart
    request.session["cart"] = []

    return {
        "success": True,
        "message": "Order placed successfully!",
        "order": {
            "orderId": order_id,
            "totalAmount": total_amount,
            "shipping": shipping,
            "itemCount": len(order_items),
        },
    }


# GET /api/orders/{id} — Get order details by ID
@router.get("/{order_id}")
def get_order_by_id(order_id: int, cur=Depends(get_db)):
    cur.execute("SELECT * FROM orders WHERE order_id = %s", (order_id,))
    order = cur.fetchone()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    cur.execute(
        """SELECT oi.*, p.name AS product_name, c.category_name
           FROM order_items oi
           JOIN products p ON oi.product_id = p.product_id
           LEFT JOIN categories c ON p.category_id = c.category_id
           WHERE oi.order_id = %s""",
        (order_id,),
    )
    items = cur.fetchall()

    return {
        "success": True,
        "order": dict(order),
        "items": [dict(i) for i in items],
    }
