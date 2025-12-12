from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, Boolean
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Conversation(Base):
    __tablename__ = "Conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(
        Enum('active', 'ended'),
        nullable=False,
        server_default='active'
    )
    start_time = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    last_message_time = Column(DateTime)
    end_time = Column(DateTime)
    messages = relationship("Message", back_populates="conversation", cascade="all, delete")

class Message(Base):
    __tablename__ = "Messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(
        Integer,
        ForeignKey("Conversations.id", ondelete="CASCADE"),
        nullable=False
    )
    sender = Column(String(50), nullable=False)  # "user" | "bot"
    content = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text('CURRENT_TIMESTAMP')
    )
    conversation = relationship("Conversation", back_populates="messages")

class DataSource(Base):
    __tablename__ = "DataSources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(150), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)
    documents = relationship("Document", back_populates="datasource")

class Document(Base):
    __tablename__ = "Documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String(150), nullable=True)
    datasource_id = Column(Integer, ForeignKey("DataSources.id"), nullable=True)
    description = Column(String(250), nullable=False)
    source_type = Column(Enum("pdf", "json", "txt"), nullable=False)
    doc_owner = Column(Enum("user", "system"), nullable=False, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    datasource = relationship("DataSource", back_populates="documents")