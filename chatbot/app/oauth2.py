from fastapi import HTTPException, status, Cookie
from config import settings
from jose import jwt, JWTError
from . import schemas

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("user_id")
        if not id:
            raise credentials_exception
        
        token_data = schemas.TokenData(id=str(id))
    except JWTError:
        raise credentials_exception
    return token_data

def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token"
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )

    token_data = verify_access_token(access_token, credentials_exception)
    user_id = int(token_data.id)
    return user_id