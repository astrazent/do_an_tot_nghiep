import os
import time
import json
import redis
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from app.redis_client import redis_client

GROUP = "writeback_group"
CONSUMER = f"worker-{os.getpid()}"
STREAM = "chat:writeback"

vn_tz = timezone(timedelta(hours=7))

def writeback_worker():
    print(f"[{datetime.now(vn_tz).isoformat()}] writeback_worker started", flush=True)

    last_log = time.time()

    while True:
        try:
            msgs = redis_client.xreadgroup(
                GROUP,
                CONSUMER,
                {STREAM: ">"},
                count=20,
                block=5000
            )

            if not msgs:
                if time.time() - last_log > 10:
                    print(f"[{datetime.now(vn_tz).isoformat()}] writeback worker alive, no messages")
                    last_log = time.time()
                continue

            for _, events in msgs:
                db: Session = SessionLocal()
                try:
                    for msg_id, data in events:
                        conversation_id = int(data["conversation_id"])
                        messages = json.loads(data["messages"])

                        for m in messages:
                            created_at = datetime.fromisoformat(m["created_at"])
                            if created_at.tzinfo is None:
                                created_at = created_at.replace(tzinfo=timezone.utc)
                            created_at = created_at.astimezone(vn_tz)

                            db.add(
                                models.Message(
                                    conversation_id=conversation_id,
                                    sender=m["sender"],
                                    content=m["content"],
                                    created_at=created_at
                                )
                            )

                        redis_client.xack(STREAM, GROUP, msg_id)
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