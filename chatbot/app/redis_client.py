from redis import Redis
from config import settings
redis_client = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    decode_responses=True,
    socket_timeout=5,
    socket_connect_timeout=5
)
try:
    redis_client.ping()
    print("Redis connected!")
except Exception as e:
    print("Redis connection failed:", e)

JSON = redis_client.json()

STREAM = "chat:writeback"