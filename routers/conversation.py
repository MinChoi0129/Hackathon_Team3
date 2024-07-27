from fastapi import APIRouter, Form, Response, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from api.models import User, Conversation, Diary

router = APIRouter()


@router.post("/conversations")
def create_conversation(user_id: int, db: Session = Depends(get_db)):
    db_conversation = Conversation(conversation_user_id=user_id)
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation


@router.get("/conversations/{user_id}")
def read_conversations_by_user(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Conversation)
        .filter(Conversation.conversation_user_id == user_id)
        .all()
    )
