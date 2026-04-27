from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import AgentOut, AgentCreate
from models import Agent

router = APIRouter(prefix="/api/agents", tags=["agents"])


@router.get("/", response_model=list[AgentOut])
def list_agents(db: Session = Depends(get_db)):
    return db.query(Agent).all()


@router.get("/{agent_id}", response_model=AgentOut)
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    return db.query(Agent).filter(Agent.id == agent_id).first()


@router.post("/", response_model=AgentOut)
def create_agent(data: AgentCreate, db: Session = Depends(get_db)):
    agent = Agent(
        name=data.name,
        emoji=data.emoji,
        description=data.description,
        category=data.category,
        system_prompt=data.system_prompt,
        model=data.model,
        tools=data.tools,
        knowledge_bases=data.knowledge_bases,
        is_preset=0,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.delete("/{agent_id}")
def delete_agent(agent_id: int, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id, Agent.is_preset == 0).first()
    if agent:
        db.delete(agent)
        db.commit()
        return {"ok": True}
    return {"ok": False, "error": "Cannot delete preset agent"}
