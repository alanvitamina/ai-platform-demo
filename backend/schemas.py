from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AgentOut(BaseModel):
    id: int
    name: str
    emoji: str
    description: str
    category: str
    system_prompt: str
    model: str
    tools: list
    knowledge_bases: list
    is_preset: int

    model_config = {"from_attributes": True}


class AgentCreate(BaseModel):
    name: str
    emoji: str = "🤖"
    description: str = ""
    category: str = "custom"
    system_prompt: str = ""
    model: str = "Claude Opus 4.7"
    tools: list = []
    knowledge_bases: list = []


class ConversationOut(BaseModel):
    id: int
    agent_id: int
    title: str
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    agent_id: int
    message: str


class ChatResponse(BaseModel):
    conversation_id: int
    message: MessageOut


class KnowledgeBaseOut(BaseModel):
    id: int
    name: str
    description: str
    doc_count: int

    model_config = {"from_attributes": True}


class DocumentOut(BaseModel):
    id: int
    kb_id: int
    title: str
    content: str
    chunk_count: int

    model_config = {"from_attributes": True}


class DocumentCreate(BaseModel):
    kb_id: int
    title: str
    content: str


class ToolOut(BaseModel):
    id: int
    name: str
    description: str
    tool_type: str
    config: dict
    is_active: int

    model_config = {"from_attributes": True}


class DataSourceOut(BaseModel):
    id: int
    name: str
    db_type: str
    description: str
    host: str
    status: str

    model_config = {"from_attributes": True}
