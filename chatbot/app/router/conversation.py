from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import status, HTTPException, Depends, APIRouter, Response
from sqlalchemy.orm import Session
from .. import schemas, models, oauth2
from ..database import get_db
from domain.chatbot import ChatBot
from app.redis_client import redis_client, JSON, STREAM
from redis.commands.json.path import Path
from config import settings
import json
import requests

router = APIRouter(
    prefix="/conversations",
    tags=['conversations']
)

bot = ChatBot(top_k=10)

@router.get("/", response_model=List[schemas.ConversationResponse])
def get_conversation(db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    conversation_query = db.query(models.Conversation)\
        .filter(models.Conversation.user_id == current_user)\
        .order_by(models.Conversation.id.asc())
    if not conversation_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User: {current_user} doesn't have conversations")
    
    return conversation_query.all()


@router.post("/", response_model=schemas.ConversationResponse)
def start_conversation(
    conversation: schemas.ConversationCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    title = conversation.title.strip()
    if not title:
        raise HTTPException(status_code=417, detail="You must enter a valid title")

    conv = models.Conversation(user_id=current_user, title=title, end_time=None)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


@router.put("/end", response_model=schemas.ConversationResponse)
def end_conversation(
    body: schemas.ConversationEnd,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    conversation_id = body.conversation_id
    conversation = db.query(models.Conversation)\
        .filter(models.Conversation.id == conversation_id, models.Conversation.user_id == current_user)\
        .first()

    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    
    if conversation.end_time is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Conversation already ended")
    
    conversation.end_time = datetime.now(timezone.utc)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.post("/messages", response_model=schemas.MessageResponse)
def add_message(
    message: schemas.MessageCreateWithConversation,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    conversation_id = message.conversation_id
    vn_tz = timezone(timedelta(hours=7))
    content = message.content.strip()
    if not content:
        raise HTTPException(status_code=417, detail="Message content cannot be empty")

    conv = db.query(models.Conversation).filter(
        models.Conversation.id == conversation_id,
        models.Conversation.user_id == current_user,
        models.Conversation.end_time == None
    ).first()

    if not conv:
        raise HTTPException(
            status_code=404,
            detail=f"Conversation {conversation_id} not found or already ended"
        )

    redis_key = f"chat:history:{conversation_id}"
    history = JSON.get(redis_key, Path(".messages"))

    if history is None:
        messages = db.query(models.Message).filter(
            models.Message.conversation_id == conversation_id
        ).order_by(models.Message.id.desc()).limit(10).all()

        msgs = [
            {
                "id": m.id,
                "sender": m.sender,
                "content": m.content,
                "created_at": m.created_at.isoformat()
            }
            for m in reversed(messages)
        ]

        JSON.set(redis_key, Path.root_path(), {"messages": msgs})
        history = msgs

    history_text = [f"{msg['sender']}: {msg['content']}" for msg in history]
    bot_reply = bot.chat(content, history_text, conversation_id)

    if isinstance(bot_reply, str) and bot_reply.strip().startswith('{') and bot_reply.strip().endswith('}'):
        bot_reply_dict = json.loads(bot_reply)

        if bot_reply_dict.get("status") == "order_ready":
            order_data_raw = bot_reply_dict.get("order_data")
            if isinstance(order_data_raw, str):
                stripped = order_data_raw.strip()
                if stripped.startswith("```") and stripped.endswith("```"):
                    stripped = "\n".join(stripped.split("\n")[1:-1])
                    if stripped.lower().startswith("json"):
                        stripped = stripped[4:].strip()
                try:
                    order_data = json.loads(stripped)
                except Exception as e:
                    print("❌ Lỗi parse JSON:", e)

            # Chuyển đổi sang chuẩn validation
            items = []
            if "product_id" in order_data and "quantity" in order_data and "product_price" in order_data and "shipping_fee" in order_data:
                amount_total = int(order_data["product_price"]) * int(order_data["quantity"])
                items.append({
                    "product_id": order_data["product_id"],
                    "qty_total": order_data["quantity"],
                    "amount_total": amount_total
                })
                amount = round(amount_total * 1.05 + int(order_data["shipping_fee"]))
            # Tạo payload chuẩn schema
            payload = {
                "user_id": current_user,
                "status": order_data.get("status"),
                "deli_name": order_data.get("deli_name"),
                "deli_phone": order_data.get("deli_phone"),
                "deli_address": order_data.get("deli_address"),
                "deli_city": None,
                "deli_district": None,
                "deli_ward": None,
                "shipping_fee": int(order_data.get("shipping_fee")),
                "shipment_status": order_data.get("shipment_status"),
                "amount": amount,
                "payment_id": order_data.get("payment_id"),
                "shipment_id": order_data.get("shipment_id"),
                "message": order_data.get("message"),
                "items": items
            }
            try:
                res = requests.post(f"{settings.BACKEND_URL}/transaction/chatbot", json=payload)
                if res.status_code == 200:
                    print("Giao dịch thành công!")
                    data = res.json()
                    bot_reply = """Cảm ơn bạn đã đặt hàng tại Bếp Sạch Việt! 🌿 Đơn hàng của bạn đã được đặt thành công.
                    Đừng quên ghé thăm lại để khám phá thêm nhiều hương vị đặc sản khác, đảm bảo sẽ làm bữa ăn của bạn thêm phong phú và ngon miệng hơn! 🍲"""
                    print(data)
                else:
                    print(f"Request lỗi! Status code: {res.status_code}")
                    print(res.text)

            except Exception as e:
                print("❌ API Error:", e)
        elif bot_reply_dict.get("status") == "order_missing_info":
            bot_reply = bot_reply_dict.get("message")

    if "||" in bot_reply:
        reply_text, product_id = bot_reply.rsplit("||", 1)
        reply_text = reply_text.strip()
        product_id = product_id.strip()
    else:
        product_id = None

    # Lưu ID vào Redis với key có conversation_id
    if product_id:
        product_key = f"product:{product_id}"
        product_data = JSON.get(product_key, Path.root_path())
        if product_data:
            # Lưu toàn bộ thông tin sản phẩm vào Redis theo conversation
            prepared_key = f"prepared_order:{conversation_id}"
            JSON.set(prepared_key, Path.root_path(), product_data)

    user_msg = {
        "conversation_id": conversation_id,
        "sender": "user",
        "content": content,
        "created_at": datetime.now(vn_tz).isoformat()
    }
    bot_msg = {
        "conversation_id": conversation_id,
        "sender": "bot",
        "content": bot_reply,
        "created_at": datetime.now(vn_tz).isoformat()
    }

    JSON.arrappend(redis_key, Path(".messages"), user_msg)
    JSON.arrappend(redis_key, Path(".messages"), bot_msg)

    history = JSON.get(redis_key, Path(".messages"))
    if len(history) > 10:
        JSON.set(redis_key, Path(".messages"), history[-10:])

    redis_client.xadd(STREAM, {
        "conversation_id": conversation_id,
        "sender": "user",
        "content": content,
        "created_at": user_msg["created_at"]
    })

    redis_client.xadd(STREAM, {
        "conversation_id": conversation_id,
        "sender": "bot",
        "content": bot_reply,
        "created_at": bot_msg["created_at"]
    })

    return bot_msg

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    conversation_query = db.query(models.Conversation)\
        .filter(models.Conversation.id == conversation_id, models.Conversation.user_id == current_user)

    if not conversation_query.first():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Conversation {conversation_id} doesn't belong to you or does not exist"
        )

    conversation_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)