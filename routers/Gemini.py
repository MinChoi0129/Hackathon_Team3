from fastapi import APIRouter, Form, Depends, Request, Cookie
from api.models import User, Conversation, ConversationString, Review, Diary
from config.database import get_db
from typing import Dict, List
from sqlalchemy.orm import Session
from datetime import datetime
import google.generativeai as genai
import json


async def classify_words(words: List[str]) -> Dict[str, List[str]]:
    if not words:
        return {}
    prompt = (
        """Classify the following words into positive, negative. if the word is not related to emotions, ignore it. Return the results in given format. "Positive": [word1, word2, ...] ||| "Negative": [word3, word4, ...]
        """
        + f"Words: {', '.join(words)}"
    )

    response = model.generate_content(prompt).text
    parts = response.split(" ||| ")

    response_dict = {}

    for part in parts:
        key, value = part.split(": ", 1)
        response_dict[key.strip('"')] = json.loads(value)

    return response_dict


router = APIRouter(tags=["AI 분석/대화"])

with open("API_KEY.txt", mode="r") as f:
    GOOGLE_API_KEY = f.readline().strip()

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(history=[])
user_chats = dict()


@router.get("/api/monthreport_by_user")
async def monthreport_by_user(
    user_id: int = Cookie(None), db: Session = Depends(get_db)
):
    month_result = dict()
    for idx, (start_date, end_date) in enumerate(
        [
            (datetime(2024, 6, 1), datetime(2024, 6, 30)),
            (datetime(2024, 7, 1), datetime(2024, 7, 31)),
            (datetime(2024, 8, 1), datetime(2024, 8, 31)),
        ]
    ):
        db_conversations = (
            db.query(Conversation)
            .filter(
                Conversation.conversation_user_id == int(user_id),
                Conversation.date >= start_date,
                Conversation.date <= end_date,
            )
            .all()
        )

        db_diaries = (
            db.query(Diary)
            .filter(
                Diary.diary_user_id == int(user_id),
                Diary.date >= start_date,
                Diary.date <= end_date,
            )
            .all()
        )

        result = []
        for conversation in db_conversations:
            result += [
                cs.text
                for cs in conversation.conversation_string_list
                if cs.who_said == "user"
            ]
        for diary in db_diaries:
            result.append(diary.diary_string)

        result = list(set(result))
        try:
            result.remove("exit_chat")
        except:
            pass
        analysis = await classify_words(result)
        month_result[idx + 6] = analysis

    return month_result


@router.post("/api/extract_emotions")
async def extract_emotions(text: str = Form(...), db: Session = Depends(get_db)):
    unique_words = list(set(text.split()))
    result = await classify_words(unique_words)
    return result


@router.post("/api/summarize_reviews/{counselor_id}")
async def summarize_reviews(counselor_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.counselor_id == counselor_id).all()
    review_texts = [review.review_text for review in reviews]
    concatenated_reviews = " ".join(review_texts)

    prompt = (
        "주어진 문장은 상담가에 대한 리뷰 모음이다. 세 문장내로 리뷰를 요약하시오."
        + concatenated_reviews
    )
    response = model.generate_content(prompt)
    summary = "".join(response.text.strip().split("\n"))

    return {"summary": summary}


@router.post("/api/chat/")
async def chat(
    user_message: str = Form(...),
    user_id: int = Cookie(None),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    # 다중 사용자 대화 세션 컨트롤
    if user_id not in user_chats:
        user_chats[user_id] = model.start_chat(history=[])

    chat: genai.ChatSession = user_chats[user_id]
    response = chat.send_message(user_message)

    if user_message == "exit_chat":
        conversation_string_list = [
            [str(item.parts[0])[7:-2].strip(), item.role] for item in chat.history
        ]

        db_conversation = Conversation(
            conversation_user_id=int(user_id), date=datetime.now()
        )

        for text, role in conversation_string_list:
            conversation_string = ConversationString(
                text=text, who_said=role, conversation_id=db_conversation.id
            )
            db_conversation.conversation_string_list.append(conversation_string)

        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)

        return {"response": response.text + "\nAI 상담이 종료되었습니다."}
    else:
        return {"response": response.text}
