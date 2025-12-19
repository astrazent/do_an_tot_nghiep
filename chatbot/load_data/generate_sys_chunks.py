import os
import json
from load_data.add_new_documents import load_all_retrievers
from app.redis_client import redis_client
import requests
from config import settings
from datetime import datetime
from redis.commands.json.path import Path
from redis.commands.search.field import TextField, NumericField, TagField
from redis.commands.search.index_definition import IndexDefinition, IndexType

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BASE_URL = settings.BACKEND_URL
DOCSTORE_DIR = os.path.join(ROOT_DIR, "docstore", "purchase-info")
os.makedirs(DOCSTORE_DIR, exist_ok=True)

PRODUCT_SCHEMA = [
    TextField("$.product_name", as_name="product_name"),
    TextField("$.product_slug", as_name="product_slug"),
    TextField("$.product_description", as_name="product_description"),

    NumericField("$.origin_price", as_name="origin_price"),
    NumericField("$.price", as_name="price"),
    NumericField("$.buyed", as_name="buyed"),
    NumericField("$.rate_point_total", as_name="rate_point_total"),
    NumericField("$.rate_count", as_name="rate_count"),
    NumericField("$.stock_qty", as_name="stock_qty"),
    NumericField("$.ocop_rating", as_name="ocop_rating"),

    TagField("$.category_name", as_name="category_name"),
    TextField("$.category_description", as_name="category_description"),

    TagField("$.discount_name", as_name="discount_name"),
    TextField("$.discount_description", as_name="discount_description"),

    TextField("$.discount_start_date", as_name="discount_start_date"),
    TextField("$.discount_end_date", as_name="discount_end_date"),
]

PAYMENT_SCHEMA = [
    TagField("$.method", as_name="method"),
]

SHIPMENT_SCHEMA = [
    TextField("$.name", as_name="name"),
    TextField("$.description", as_name="description"),
    NumericField("$.base_fee", as_name="base_fee"),
]

def format_discount_value(value):
    if isinstance(value, float):
        value = int(value)
    if value == 100:
        return "Miễn phí"
    if 1 <= value <= 100:
        return f"{value}%"
    if value > 100:
        return f"{value:,} VND"
    return str(value)


def format_datetime(dt):
    if not dt:
        return ""
    try:
        d = datetime.fromisoformat(dt.replace("Z", "+00:00"))
        return d.strftime("%d/%m/%Y %H:%M")
    except:
        return dt


def serialize_raw_value(val):
    if val is None:
        return None

    if isinstance(val, str) and val.replace(".", "", 1).isdigit():
        try:
            return float(val)
        except:
            return val

    if isinstance(val, str) and "T" in val and "Z" in val:
        return val

    return val


def sync_json_to_redis(api_data, key_prefix, id_field, index_name=None, index_schema=None):
    if isinstance(api_data, dict):
        items = api_data.get("data", [])
    else:
        items = api_data

    saved = 0

    for item in items:
        record_id = item.get(id_field)
        if not record_id:
            continue

        redis_key = f"{key_prefix}:{record_id}"
        clean_data = {key: serialize_raw_value(value) for key, value in item.items()}
        redis_client.json().set(redis_key, Path.root_path(), clean_data)
        saved += 1

    if index_name and index_schema:
        try:
            redis_client.ft(index_name).info()
        except Exception:
            redis_client.ft(index_name).create_index(
                index_schema,
                definition=IndexDefinition(prefix=[f"{key_prefix}:"], index_type=IndexType.JSON)
            )

    return saved

def generate_product_chunks():
    url = f"{BASE_URL}/products/chatbot?limit=150&offset=0"
    response = requests.get(url)
    res = response.json()
    products = res.get("data", [])
    saved = sync_json_to_redis(
    api_data=products,
    key_prefix="product",
    id_field="id",
    index_name="products_idx",
    index_schema=PRODUCT_SCHEMA
    )
    print("Saved products to redis:", saved)
    chunks = []

    for p in products:
        rate_count = p.get("rate_count", 0) or 0
        rate_total = p.get("rate_point_total", 0) or 0
        rate_avg = (rate_total / rate_count) if rate_count else 0

        tags = []
        if p.get("product_name"):
            tags.extend(p["product_name"].lower().split())
        if p.get("product_slug"):
            tags.extend(p["product_slug"].lower().split('-'))
        if p.get("category_name"):
            tags.append(p["category_name"].lower())
        tags = list(set(tags))

        text_content = f"""
        Tên sản phẩm: {p.get("product_name")}
        Mô tả sản phẩm: {p.get("product_description") or "Không có mô tả"}
        Giá gốc: {p.get("origin_price")} VND
        Giá bán: {p.get("price")} VND
        Danh mục: {p.get("category_name")}
        Mô tả danh mục: {p.get("category_description") or "Không có mô tả danh mục"}
        """.strip()

        # Khuyến mãi
        discount = None
        if p.get("discount_status") == 1:
            discount_value = float(p.get("discount_value"))
            discount = {
                "tên": p.get("discount_name"),
                "giá_trị": format_discount_value(discount_value),
                "mô_tả": p.get("discount_description"),
                "ngày_bắt_đầu": format_datetime(p.get("discount_start_date")),
                "ngày_kết_thúc": format_datetime(p.get("discount_end_date"))
            }

        metadata = {
            "id": p.get("id"),
            "tồn_kho": f"{p.get('stock_qty')} sản phẩm",
            "trạng_thái": "đang_kinh_doanh" if p.get("product_status") == 1 else "ngừng_kinh_doanh",
            "điểm_trung_bình": rate_avg,
            "số_lượt_đánh_giá": rate_count,
            "từ_khóa": tags,
            "url": p.get("main_image_url"),
            "khuyến_mãi": [discount] if discount else []
        }

        chunks.append({
            "text": text_content,
            "metadata": metadata
        })

    os.makedirs(DOCSTORE_DIR, exist_ok=True)
    output_file = os.path.join(DOCSTORE_DIR, "products.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"Đã tạo {len(chunks)} chunk sản phẩm thành công. File: {output_file}")

def generate_shipment_chunks():
    try:
        url = f"{BASE_URL}/shipment/getAll"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        data = data.get("data", [])
        saved = sync_json_to_redis(
        api_data=data,
        key_prefix="shipment",
        id_field="id",
        index_name="shipments_idx",
        index_schema=SHIPMENT_SCHEMA
        )
        print("Saved shipments to redis:", saved)
        shipment_chunks = []

        for s in data:
            if s.get("status") != 1:
                continue

            # Convert base_fee -> int
            raw_base_fee = s.get("base_fee", "0")
            try:
                base_fee = int(float(raw_base_fee))
            except:
                base_fee = 0

            # Text content cho LLM
            text_content = f"""
            Tên phương thức vận chuyển: {s.get('name')}
            Mô tả: {s.get('description') or 'Không có mô tả'}
            Phí cơ bản: {base_fee:,} VND
            Trạng thái: Hoạt động
            """.strip()

            # Metadata tiếng Việt có dấu + đơn vị rõ ràng
            metadata = {
                "id": s.get("id"),
                "tên_phương_thức": s.get("name"),
                "mô_tả": s.get("description") or "Không có mô tả",
                "phí_cơ_bản": f"{base_fee:,} VND",
                "trạng_thái": "hoạt động",
                "url": s.get("icon_url")
            }

            shipment_chunks.append({
                "text": text_content,
                "metadata": metadata
            })

        # Lưu file JSON
        if not os.path.exists(DOCSTORE_DIR):
            os.makedirs(DOCSTORE_DIR)

        output_file = os.path.join(DOCSTORE_DIR, "shipments.json")

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(shipment_chunks, f, ensure_ascii=False, indent=2)

        print(f"Đã tạo {len(shipment_chunks)} shipment chunks thành công. File: {output_file}")

    except Exception as e:
        print("Lỗi khi tạo shipment chunks:", e)

def generate_payment_chunks():
    try:
        url = f"{BASE_URL}/payment/list"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        data = data.get("data", [])
        saved = sync_json_to_redis(
        api_data=data,
        key_prefix="payment",
        id_field="id",
        index_name="payments_idx",
        index_schema=PAYMENT_SCHEMA
        )
        print("Saved payments to redis:", saved)
        payment_chunks = []

        for p in data:
            if p.get("status") != 1:
                continue

            text_content = f"""
            Phương thức thanh toán: {p.get('method')}
            Trạng thái: Hoạt động
            """.strip()

            metadata = {
                "id": p.get("id"),
                "tên_phương_thức": p.get("method"),
                "trạng_thái": "hoạt động",
                "url": p.get("icon_url")
            }

            payment_chunks.append({
                "text": text_content,
                "metadata": metadata
            })

        # Lưu file
        if not os.path.exists(DOCSTORE_DIR):
            os.makedirs(DOCSTORE_DIR)

        output_file = os.path.join(DOCSTORE_DIR, "payments.json")

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(payment_chunks, f, ensure_ascii=False, indent=2)

        print(f"Đã tạo {len(payment_chunks)} payment chunks thành công. File: {output_file}")

    except Exception as e:
        print("Lỗi khi tạo payment chunks:", e)

if __name__ == "__main__":
    generate_product_chunks()
    generate_shipment_chunks()
    generate_payment_chunks()
    load_all_retrievers()