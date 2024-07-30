from fastapi import APIRouter, Form, Depends, Cookie
from api.models import Diary
from config.database import get_db
from sqlalchemy.orm import Session
import datetime

router = APIRouter(tags=["일기"])


@router.post("/api/diaries")
def create_diary_by_user(
    user_id: str = Cookie(None),
    diary_string: str = Form(...),
    db: Session = Depends(get_db),
):
    db_diary = Diary(
        diary_user_id=int(user_id),
        diary_string=diary_string,
        date=datetime.datetime.now(),
    )
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    return db_diary


@router.get("/api/diaries")
def read_diaries_by_user(user_id: str = Cookie(None), db: Session = Depends(get_db)):
    return db.query(Diary).filter(Diary.diary_user_id == int(user_id)).all()
