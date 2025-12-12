from app.redis_client import redis_client, JSON
def get_all_json(prefix: str):
    """
    Lấy toàn bộ JSON đã lưu trong Redis theo prefix.
    Ví dụ: prefix="product" => lấy product:1, product:2, ...
    """
    cursor = 0
    results = []

    while True:
        cursor, keys = redis_client.scan(
            cursor=cursor,
            match=f"{prefix}:*",
            count=200
        )

        for key in keys:
            try:
                data = JSON.get(key)
                results.append({
                    "key": key,
                    "data": data
                })
            except Exception:
                # Key không phải JSON → bỏ qua
                pass

        if cursor == 0:
            break

    return results

def get_all_json_no_prefix():
    """
    Lấy tất cả key JSON trong Redis (không cần prefix).
    Dùng SCAN để không block Redis.
    """
    cursor = 0
    results = []

    while True:
        cursor, keys = redis_client.scan(cursor=cursor, match="*", count=200)

        for key in keys:
            try:
                data = JSON.get(key)
                if data is not None:
                    results.append({
                        "key": key,
                        "data": data
                    })
            except Exception:
                pass

        if cursor == 0:
            break

    return results

def get_all_redis_data():
    """
    Lấy toàn bộ keys + nội dung tương ứng trong Redis.
    Hỗ trợ:
    - JSON
    - String
    - Hash
    - List
    - Set
    - ZSet
    """
    cursor = 0
    all_data = {}

    while True:
        cursor, keys = redis_client.scan(cursor=cursor, match="*", count=200)

        for key in keys:
            key_type = redis_client.type(key)

            if key_type == "json":
                try:
                    value = redis_client.json().get(key)
                except:
                    value = None

            elif key_type == "string":
                value = redis_client.get(key)

            elif key_type == "hash":
                value = redis_client.hgetall(key)

            elif key_type == "list":
                value = redis_client.lrange(key, 0, -1)

            elif key_type == "set":
                value = list(redis_client.smembers(key))

            elif key_type == "zset":
                value = redis_client.zrange(key, 0, -1, withscores=True)

            else:
                value = None

            all_data[key] = {
                "type": key_type,
                "value": value
            }

        if cursor == 0:
            break

    return all_data

def clear_all_redis():
    """
    Xoá toàn bộ dữ liệu trong Redis.
    Dùng FLUSHDB để tránh xoá nhầm DB khác.
    """
    try:
        redis_client.flushdb()
        print("🔥 Đã xoá toàn bộ dữ liệu trong Redis (FLUSHDB).")
    except Exception as e:
        print("❌ Lỗi khi xoá Redis:", e)

# lấy toàn bộ mọi thứ có trên redis
# data = get_all_redis_data()
# for key, info in data.items():
#     print(f"\n🔑 Key: {key}")
#     print(f"   Type: {info['type']}")
#     print(f"   Value: {info['value']}")

#Lấy toàn bộ danh sách
# products = get_all_json("shipment")

# for item in products:
#     print(item["key"], item["data"])
#     break
# Lấy tổng số key
# all_data = get_all_json_no_prefix()

# print(len(all_data), "JSON keys found")


# xoá toàn bộ redis
clear_all_redis()

# Liệt kê toàn bộ index
# print(redis_client.execute_command("FT._LIST"))

# test thử chatbot redis command
# result = redis_client.execute_command("FT.SEARCH", "products_idx", "*", "LIMIT", 0, 0)
# total = result[0]
# print("Total docs =", total)

# from domain.llm_factory import get_llm, get_api_key
# for i in range(5):
#     llm = get_llm(i)
#     print(f"LLM {i}: {get_api_key(llm)}")