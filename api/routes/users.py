from fastapi import APIRouter, Depends
from models.user import User
from api.deps_auth import get_current_user
from schemas.user import UserPublic

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserPublic)
async def me(user: User = Depends(get_current_user)):
    return UserPublic(id=user.id, email=user.email)