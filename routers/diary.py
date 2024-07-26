from fastapi import APIRouter, Form, Response, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from api.models import User, Conversation, Diary

router = APIRouter()


@router.post("/diaries/", response_model=Diary)
def create_diary(user_id: int, diary_string: str, db: Session = Depends(get_db)):
    db_diary = Diary(diary_user_id=user_id, diary_string=diary_string)
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    return db_diary


@router.get("/diaries/{user_id}", response_model=list[Diary])
def read_diaries_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Diary).filter(Diary.diary_user_id == user_id).all()
