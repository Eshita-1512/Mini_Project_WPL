from fastapi import Request, HTTPException


async def require_admin(request: Request):
    """
    FastAPI dependency — protects admin routes.
    Checks if an admin session exists, raises 401 otherwise.
    """
    admin = request.session.get("admin")
    if not admin:
        raise HTTPException(status_code=401, detail="Unauthorized. Admin login required.")
    return admin


async def require_user(request: Request):
    """Protects user routes (cart, orders, checkout)."""
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Please login to continue.")
    return user
