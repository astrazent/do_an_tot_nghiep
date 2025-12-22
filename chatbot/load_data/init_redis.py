from app.redis_client import redis_client
import redis

try:
    redis_client.xgroup_create(
        "chat:writeback",
        "writeback_group",
        id="$",
        mkstream=True
    )
except redis.exceptions.ResponseError as e:
    if "BUSYGROUP" not in str(e):
        raise