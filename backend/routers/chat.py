from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import ChatRequest, ChatResponse, MessageOut
from models import Conversation, Message
from services.llm_simulator import simulate_response
import time
import random

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/send", response_model=ChatResponse)
def send_message(req: ChatRequest, db: Session = Depends(get_db)):
    # Get or create conversation
    if req.conversation_id:
        conv = db.query(Conversation).filter(Conversation.id == req.conversation_id).first()
        if not conv:
            conv = Conversation(agent_id=req.agent_id, title=req.message[:50])
            db.add(conv)
            db.flush()
    else:
        conv = Conversation(agent_id=req.agent_id, title=req.message[:50])
        db.add(conv)
        db.flush()

    # Save user message
    user_msg = Message(conversation_id=conv.id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()

    # Generate simulated response (with a small delay to feel realistic)
    response_content = simulate_response(req.agent_id, req.message, db)

    # Save assistant message
    assistant_msg = Message(conversation_id=conv.id, role="assistant", content=response_content)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return ChatResponse(
        conversation_id=conv.id,
        message=MessageOut(
            id=assistant_msg.id,
            conversation_id=assistant_msg.conversation_id,
            role=assistant_msg.role,
            content=assistant_msg.content,
            created_at=assistant_msg.created_at,
        ),
    )


@router.get("/conversations/{agent_id}")
def list_conversations(agent_id: int, db: Session = Depends(get_db)):
    convs = (
        db.query(Conversation)
        .filter(Conversation.agent_id == agent_id)
        .order_by(Conversation.created_at.desc())
        .all()
    )
    return [
        {"id": c.id, "title": c.title, "created_at": c.created_at.isoformat()}
        for c in convs
    ]


@router.get("/messages/{conversation_id}")
def get_messages(conversation_id: int, db: Session = Depends(get_db)):
    msgs = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
        }
        for m in msgs
    ]
