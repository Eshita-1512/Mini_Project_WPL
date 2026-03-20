from fastapi import APIRouter, Depends, Request, HTTPException

from database import get_db
from schemas.models import AdminLoginRequest, AddProductRequest, EditProductRequest
from middleware.auth_middleware import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# Admin Auth

# login
@router.post("/login")
def admin_login(request: Request, body: AdminLoginRequest, cur=Depends(get_db)):
    cur.execute(
        "SELECT * FROM admin WHERE username = %s AND password = %s",
        (body.username, body.password),
    )
    row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    admin_data = {
        "adminId": row["admin_id"],
        "username": row["username"],
    }
    request.session["admin"] = admin_data

    return {"success": True, "message": "Admin logged in", "admin": admin_data}


# logout
@router.post("/logout")
def admin_logout(request: Request):
    request.session.pop("admin", None)
    return {"success": True, "message": "Admin logged out"}


#Product CRUD


# GET products
@router.get("/products")
def get_all_products(cur=Depends(get_db), admin: dict = Depends(require_admin)):
    cur.execute(
        """
        SELECT p.*, c.category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.product_id DESC
        """
    )
    rows = cur.fetchall()
    return {"success": True, "count": len(rows), "products": [dict(r) for r in rows]}


# POST products
@router.post("/products")
def add_product(
    body: AddProductRequest,
    cur=Depends(get_db),
    admin: dict = Depends(require_admin),
):
    cur.execute(
        """INSERT INTO products (name, description, original_price, stock_quantity, category_id)
           VALUES (%s, %s, %s, %s, %s) RETURNING product_id""",
        (body.name, body.description, body.price, body.stock, body.category_id),
    )
    row = cur.fetchone()

    return {
        "success": True,
        "message": "Product added",
        "productId": row["product_id"],
    }


# PUT products/{id}
@router.put("/products/{product_id}")
def edit_product(
    product_id: int,
    body: EditProductRequest,
    cur=Depends(get_db),
    admin: dict = Depends(require_admin),
):
    cur.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    existing = cur.fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    cur.execute(
        """UPDATE products
           SET name = %s, description = %s, original_price = %s, stock_quantity = %s, category_id = %s
           WHERE product_id = %s""",
        (
            body.name or existing["name"],
            body.description or existing["description"],
            body.price if body.price is not None else existing["original_price"],
            body.stock if body.stock is not None else existing["stock_quantity"],
            body.category_id if body.category_id is not None else existing["category_id"],
            product_id,
        ),
    )

    return {"success": True, "message": "Product updated"}


# DELETE products/{id}
@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    cur=Depends(get_db),
    admin: dict = Depends(require_admin),
):
    cur.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
    existing = cur.fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    cur.execute("DELETE FROM products WHERE product_id = %s", (product_id,))

    return {"success": True, "message": "Product deleted"}


# ─── Order Management ────────────────────────────────────


# GET /api/admin/orders
@router.get("/orders")
def get_all_orders(cur=Depends(get_db), admin: dict = Depends(require_admin)):
    cur.execute(
        """SELECT o.*, u.name AS customer_name, u.email AS customer_email
           FROM orders o
           JOIN users u ON o.user_id = u.user_id
           ORDER BY o.order_date DESC"""
    )
    rows = cur.fetchall()
    return {"success": True, "count": len(rows), "orders": [dict(r) for r in rows]}


# GET /api/admin/orders/{id}
@router.get("/orders/{order_id}")
def get_order_by_id(
    order_id: int,
    cur=Depends(get_db),
    admin: dict = Depends(require_admin),
):
    cur.execute(
        """SELECT o.*, u.name AS customer_name, u.email, u.phone
           FROM orders o
           JOIN users u ON o.user_id = u.user_id
           WHERE o.order_id = %s""",
        (order_id,),
    )
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

    return {"success": True, "order": dict(order), "items": [dict(i) for i in items]}
