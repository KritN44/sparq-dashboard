import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.auth.jwt import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.config import settings
from app.exceptions import ConflictError, UnauthorizedError
from app.models.user import RefreshToken, User
from app.schemas.auth import RegisterRequest

logger = logging.getLogger(__name__)


def register_user(db: Session, data: RegisterRequest) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise ConflictError("Email already registered")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("User registered: %s", user.email)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise UnauthorizedError("Invalid email or password")
    if not user.is_active:
        raise UnauthorizedError("Account is disabled")
    return user


def create_tokens(db: Session, user: User) -> dict:
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.now(timezone.utc)
        + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(db_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def refresh_tokens(db: Session, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid refresh token")

    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == refresh_token, RefreshToken.revoked.is_(False))
        .first()
    )
    if not db_token:
        raise UnauthorizedError("Refresh token not found or revoked")

    if db_token.expires_at < datetime.now(timezone.utc):
        raise UnauthorizedError("Refresh token expired")

    db_token.revoked = True
    db.commit()

    user = db.query(User).filter(User.id == int(payload.get("sub", 0))).first()
    if not user:
        raise UnauthorizedError("User not found")

    return create_tokens(db, user)


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    db_token = (
        db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    )
    if db_token:
        db_token.revoked = True
        db.commit()
