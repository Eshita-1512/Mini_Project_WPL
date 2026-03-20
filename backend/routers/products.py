from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional

from database import get_db

router = APIRouter(prefix="/api/products", tags=["Products"])


# GET /api/products/categories — Get all categories
@router.get("/categories")
def get_categories(cur=Depends(get_db)):
    cur.execute("SELECT * FROM categories ORDER BY category_name ASC")
    rows = cur.fetchall()
    return {"success": True, "count": len(rows), "categories": [dict(r) for r in rows]}


# GET /api/products — Get all products (supports ?sort= and ?search=)
@router.get("/")
def get_all_products(
    sort: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    cur=Depends(get_db),
):
    query = """
        SELECT p.*, c.category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
    """
    params: list = []

    # Search filter
    if search:
        params.append(f"%{search}%")
        query += " WHERE p.name ILIKE %s"

    # Sort
    if sort == "price_asc":
        query += " ORDER BY p.original_price ASC"
    elif sort == "price_desc":
        query += " ORDER BY p.original_price DESC"
    else:
        query += " ORDER BY p.product_id DESC"

    cur.execute(query, params or None)
    rows = cur.fetchall()

    # Apply 25% discount on all prices
    products = []
    for row in rows:
        product = dict(row)
        product["discounted_price"] = round(float(product["original_price"]) * 0.75, 2)
        products.append(product)

    return {"success": True, "count": len(products), "products": products}


# GET /api/products/{id} — Get single product by ID
@router.get("/{product_id}")
def get_product_by_id(product_id: int, cur=Depends(get_db)):
    cur.execute(
        """
        SELECT p.*, c.category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = %s
        """, 
        (product_id,)
    )
    product = cur.fetchone()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product = dict(product)
    product["discounted_price"] = round(float(product["original_price"]) * 0.75, 2)

    return {"success": True, "product": product}
