from fastapi import APIRouter, Form, Depends, Cookie
from api.models import Conversation, ConversationString
from config.database import get_db
from sqlalchemy.orm import Session
from datetime import datetime


router = APIRouter()


@router.post("/api/conversations")
def create_conversation_by_user(
    conversations: str = Form(...),
    user_id: str = Cookie(None),
    db: Session = Depends(get_db),
):
    conversation_string_list = conversations.split("|||")

    # Conversation 객체 생성
    db_conversation = Conversation(
        conversation_user_id=int(user_id), date=datetime.now()
    )

    # ConversationString 객체를 생성하고 Conversation에 추가
    for text in conversation_string_list:
        conversation_string = ConversationString(
            text=text, conversation_id=db_conversation.id
        )
        db_conversation.conversation_string_list.append(conversation_string)

    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation


@router.get("/api/conversations")
def read_conversations_by_user(
    user_id: str = Cookie(None), db: Session = Depends(get_db)
):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.conversation_user_id == int(user_id))
        .all()
    )

    result = []
    for conversation in conversations:
        conversation_dict = {
            "conversations": [cs.text for cs in conversation.conversation_string_list],
        }
        result.append(conversation_dict)

    return result
