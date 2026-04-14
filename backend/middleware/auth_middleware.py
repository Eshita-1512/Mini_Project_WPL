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
