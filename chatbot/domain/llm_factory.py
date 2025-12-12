from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr
from config import settings

API_KEYS = [
    settings.API_KEY_1,
    settings.API_KEY_2,
    settings.API_KEY_3,
    settings.API_KEY_4,
    settings.API_KEY_5,
    settings.API_KEY_6,
    settings.API_KEY_7
]

# Khởi tạo sẵn 7 instance
LLM_INSTANCES = [
    ChatGoogleGenerativeAI(model=settings.GEMINI_MODEL, api_key=key, temperature=settings.TEMPERATURE)
    for key in API_KEYS
]

def get_llm(index: int = 0) -> ChatGoogleGenerativeAI:
    """
    Lấy instance theo index từ 0 đến 6
    """
    if 0 <= index < len(LLM_INSTANCES):
        return LLM_INSTANCES[index]
    raise ValueError(f"Index {index} ngoài phạm vi LLM_INSTANCES (0-{len(LLM_INSTANCES)-1})")

def get_api_key(instance: ChatGoogleGenerativeAI) -> str:
    secret = getattr(instance, "google_api_key", None)
    if isinstance(secret, SecretStr):
        return secret.get_secret_value()
    return "unknown"