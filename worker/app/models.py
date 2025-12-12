from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
from .database import Base
class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True)
    email = Column(String(100), unique=True, nullable=False)

    password_hash = Column(String(255))

    full_name = Column(String(100))
    avatar_url = Column(String(255))

    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    conversations = relationship("Conversation", back_populates="owner")

class Conversation(Base):
    __tablename__ = "Conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)

    status = Column(
        Enum('active', 'ended'),
        nullable=False,
        server_default='active'
    )

    start_time = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    last_message_time = Column(DateTime)
    end_time = Column(DateTime)

    owner = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete")

class Message(Base):
    __tablename__ = "Messages"

    id = Column(Integer, primary_key=True, autoincrement=True)

    conversation_id = Column(
        Integer,
        ForeignKey("Conversations.id", ondelete="CASCADE"),
        nullable=False
    )

    sender = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text('CURRENT_TIMESTAMP')
    )

    conversation = relationship("Conversation", back_populates="messages")