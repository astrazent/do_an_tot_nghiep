import os
import time
import json
import redis
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.redis_client import redis_client

# ====== Cấu hình worker ======
GROUP = "writeback_group"                       # Tên group Redis Stream consumer
CONSUMER = f"worker-{os.getpid()}"             # Tên consumer, dùng PID để tạo duy nhất
STREAM = "chat:writeback"                       # Tên stream Redis dùng để lưu chat messages

# Múi giờ Việt Nam UTC+7
vn_tz = timezone(timedelta(hours=7))


def writeback_worker():
    """
    Worker liên tục đọc message từ Redis Stream và lưu vào DB.
    Sử dụng Redis Stream + Consumer Group để đảm bảo:
    - Không bỏ lỡ message.
    - Xử lý song song nhiều consumer nếu cần.
    """

    print(f"[{datetime.now(vn_tz).isoformat()}] writeback_worker started", flush=True)

    last_log = time.time()  # Thời gian log lần cuối khi không có message

    while True:
        try:
            # ====== Đọc message từ Redis Stream ======
            # xreadgroup: đọc messages từ stream theo consumer group
            # {STREAM: ">"}: chỉ lấy message mới (chưa ack)
            # count=20: lấy tối đa 20 message mỗi lần
            # block=5000: block tối đa 5000ms (5s) nếu không có message
            msgs = redis_client.xreadgroup(
                GROUP,
                CONSUMER,
                {STREAM: ">"},
                count=20,
                block=5000
            )

            # acknowledgment” – tức là xác nhận đã nhận và xử lý message thành công.
            if not msgs:
                # Log "alive" mỗi 10 giây để biết worker vẫn chạy
                if time.time() - last_log > 10:
                    print(f"[{datetime.now(vn_tz).isoformat()}] writeback worker alive, no messages")
                    last_log = time.time()
                continue

            for _, events in msgs:
                db: Session = SessionLocal()  # Mở session DB
                try:
                    for msg_id, data in events:
                        conversation_id = int(data["conversation_id"])
                        messages = json.loads(data["messages"])  # load danh sách message từ JSON

                        for m in messages:
                            created_at = datetime.fromisoformat(m["created_at"])
                            if created_at.tzinfo is None:
                                created_at = created_at.replace(tzinfo=timezone.utc)
                            created_at = created_at.astimezone(vn_tz)

                            # Thêm message vào session DB
                            db.add(
                                models.Message(
                                    conversation_id=conversation_id,
                                    sender=m["sender"],
                                    content=m["content"],
                                    created_at=created_at
                                )
                            )
                        redis_client.xack(STREAM, GROUP, msg_id) # Redis ghi nhận ack
                        print(f"[{datetime.now(vn_tz).isoformat()}] Saved conversation {conversation_id}")
                        
                    db.commit()

                except Exception as e:
                    print(f"[{datetime.now(vn_tz).isoformat()}] Writeback failed: {e}")
                    db.rollback()

                finally:
                    db.close()

        except Exception as e:
            print(f"[{datetime.now(vn_tz).isoformat()}] Worker outer exception: {e}")
            time.sleep(5)

if __name__ == "__main__":
    writeback_worker()