from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import ToolOut, DataSourceOut
from models import Tool, DataSource

router = APIRouter(prefix="/api", tags=["tools"])


@router.get("/tools", response_model=list[ToolOut])
def list_tools(db: Session = Depends(get_db)):
    return db.query(Tool).all()


@router.get("/datasources", response_model=list[DataSourceOut])
def list_datasources(db: Session = Depends(get_db)):
    return db.query(DataSource).all()
