from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

# -------------------
# Token schemas
# -------------------
class TokenData(BaseModel):
    id: Optional[str] = None

# -------------------
# Message schemas
# -------------------
class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    conversation_id: int
    sender: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreateWithConversation(BaseModel):
    conversation_id: int
    content: str

# -------------------
# Conversation schemas
# -------------------
class ConversationResponse(BaseModel):
    id: int  # khớp với Conversation.id
    user_id: int
    title: str
    status: str
    start_time: datetime
    last_message_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    messages: Optional[List[MessageResponse]] = []

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: str

class ConversationEnd(BaseModel):
    conversation_id: int

# -------------------
# Datasource schemas
# -------------------
class DataSourceBase(BaseModel):
    name: str | None = None
    slug: str | None = None

class DataSourceCreate(BaseModel):
    name: str
    slug: str
    description: str
    is_active: bool

class DataSourceUpdateBySlug(BaseModel):
    slug: str
    name: str | None = None
    new_slug: str | None = None
    description: str | None = None
    is_active: bool | None = None

class DataSourceResponse(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {
        "from_attributes": True
    }