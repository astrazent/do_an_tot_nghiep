from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Build database URL từ settings
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{settings.DATABASE_USERNAME}:"
    f"{settings.DATABASE_PASSWORD}@"
    f"{settings.DATABASE_HOSTNAME}:"
    f"{settings.DATABASE_PORT}/"
    f"{settings.DATABASE_NAME}?charset=utf8mb4"
)

# Tạo engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True  # tránh timeout khi idle
)

# Tạo sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base để tạo model
Base = declarative_base()

# Dependency cho FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()