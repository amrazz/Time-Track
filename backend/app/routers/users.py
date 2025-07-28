from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from deps import get_current_user
from database.schemas.auth import UserModel
from database.db_config import user_db
from core.security import *
from loguru import logger

router = APIRouter()


@router.get("/me")
def get_loggedin_user(current_user: Annotated[UserModel, Depends(get_current_user)]):
    return current_user
