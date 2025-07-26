from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from database.schemas.auth import Token, UserRegister
from database.db_config import user_db
from core.security import *
from loguru import logger

router = APIRouter()


@router.post("/register")
async def create_user(request: UserRegister):
    try:
        existing_email = user_db.find_one({"email": request.email})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )

        hashed_password = hash_password(request.password)
        user_object = dict(request)
        user_object["password"] = hashed_password
        user_id = user_db.insert_one(user_object)

        return {"detail": "User registered successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

@router.post("/login")
async def user_login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    logger.info(f"This is user from login : ${form_data.username}, {form_data.password}")
    user = user_db.find_one({"email" : form_data.username})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User does not exists.")
    
    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail="Password does not match.")
    
    access_token = create_access_token(data = {"sub" : user["email"]})
    return {"access_token" : access_token, "token_type" : "bearer"}