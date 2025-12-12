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
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), '.env'))
settings = Settings()