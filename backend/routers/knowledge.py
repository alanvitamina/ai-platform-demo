from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import KnowledgeBaseOut, DocumentOut, DocumentCreate
from models import KnowledgeBase, Document

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])


@router.get("/bases", response_model=list[KnowledgeBaseOut])
def list_kbs(db: Session = Depends(get_db)):
    return db.query(KnowledgeBase).all()


@router.get("/bases/{kb_id}/documents", response_model=list[DocumentOut])
def list_documents(kb_id: int, db: Session = Depends(get_db)):
    return db.query(Document).filter(Document.kb_id == kb_id).all()


@router.post("/documents", response_model=DocumentOut)
def create_document(data: DocumentCreate, db: Session = Depends(get_db)):
    doc = Document(
        kb_id=data.kb_id,
        title=data.title,
        content=data.content,
        chunk_count=max(1, len(data.content) // 500),
    )
    db.add(doc)

    # Update doc count
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == data.kb_id).first()
    if kb:
        kb.doc_count = (kb.doc_count or 0) + 1

    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if doc:
        kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == doc.kb_id).first()
        if kb:
            kb.doc_count = max(0, (kb.doc_count or 0) - 1)
        db.delete(doc)
        db.commit()
        return {"ok": True}
    return {"ok": False}
