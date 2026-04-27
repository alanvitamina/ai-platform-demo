from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    emoji = Column(String(10))
    description = Column(Text)
    category = Column(String(100))
    system_prompt = Column(Text)
    model = Column(String(100))
    tools = Column(JSON)
    knowledge_bases = Column(JSON)
    is_preset = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    conversations = relationship("Conversation", back_populates="agent")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    title = Column(String(200))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    agent = relationship("Agent", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String(20))  # user, assistant
    content = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    conversation = relationship("Conversation", back_populates="messages")


class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    description = Column(Text)
    doc_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    documents = relationship("Document", back_populates="kb")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    kb_id = Column(Integer, ForeignKey("knowledge_bases.id"))
    title = Column(String(200))
    content = Column(Text)
    chunk_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    kb = relationship("KnowledgeBase", back_populates="documents")


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    description = Column(Text)
    tool_type = Column(String(50))  # api, mcp, database, feishu
    config = Column(JSON)
    is_active = Column(Integer, default=1)


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    db_type = Column(String(50))  # postgresql, milvus, tdengine, neo4j
    description = Column(Text)
    host = Column(String(200))
    status = Column(String(20), default="connected")
