from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DATABASE_HOSTNAME : str
    DATABASE_PORT : str
    DATABASE_PASSWORD : str
    DATABASE_NAME : str
    DATABASE_USERNAME : str
    REDIS_PASSWORD : str
    REDIS_HOST : str
    REDIS_PORT : str
    REDIS_DB : str
    SECRET_KEY : str
    ALGORITHM : str
    API_KEY_1: str
    API_KEY_2: str
    API_KEY_3: str
    API_KEY_4: str
    API_KEY_5: str
    API_KEY_6: str
    API_KEY_7: str
    CHROMA_DB_DIR: str
    BACKEND_URL : str
    GEMINI_MODEL: str
    EMBEDDING_MODEL: str
    TEMPERATURE: float
    CHUNK_SIZE: int
    OVERLAP_SIZE: int
    MAX_BATCH_SIZE: int
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), '.env'))
settings = Settings()