from fastapi import APIRouter, Form, Response, Depends, HTTPException, Request, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from api.models import User, Conversation, Diary, Payment, Counselor
from config.database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import re


router = APIRouter()


@router.post("/api/diaries")
def create_diary_by_user(
    user_id: str = Cookie(None),
    diary_string: str = Form(...),
    db: Session = Depends(get_db),
):
    db_diary = Diary(diary_user_id=int(user_id), diary_string=diary_string)
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    return db_diary


@router.get("/api/diaries")
def read_diaries_by_user(user_id: str = Cookie(None), db: Session = Depends(get_db)):
    return db.query(Diary).filter(Diary.diary_user_id == int(user_id)).all()
