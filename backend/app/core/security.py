import os
from dotenv import load_dotenv
import jwt
from jose import JWTError, jwt
from passlib.context import CryptContext
from jwt.exceptions import InvalidTokenError
from database.schemas.token import TokenData
from pydantic import EmailStr
from database.db_config import user_db
from datetime import datetime, timedelta, timezone

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 110


pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_cxt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_cxt.verify(plain_password, hashed_password)


# _-----------------------------------------------


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user(email: EmailStr):
    user = user_db.find_one({"email": email})
    if user:
        return {
            "email": user["email"],
            "full_name": user["full_name"],
            "id": str(user["id"]),
        }
    return None


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
        token_data = TokenData(email=email)
        user = get_user(token_data.email)
        if not user:
            raise credentials_exception
        return user
    except InvalidTokenError:
        raise credentials_exception

    except JWTError:
        raise credentials_exception
