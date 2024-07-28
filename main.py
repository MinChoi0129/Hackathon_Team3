from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import Gemini, auth, payment, html, conversation, diary, counselor
from config.database import engine, Base

app = FastAPI()

# static 폴더 연결
app.mount("/static", StaticFiles(directory="static"), name="static")

# 데이터베이스 초기화
Base.metadata.create_all(bind=engine)

# 라우터 포함
app.include_router(html.router)
app.include_router(auth.router)
app.include_router(diary.router)
app.include_router(conversation.router)
app.include_router(counselor.router)
app.include_router(payment.router)
app.include_router(Gemini.router)
