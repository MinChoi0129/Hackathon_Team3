from fastapi import APIRouter, Form, Response, Depends, HTTPException, Request, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from api.models import User, Conversation, Diary, Payment, Counselor
from config.database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import re
import random

router = APIRouter()

# id = Column(Integer, primary_key=True)
# profile_img_path = Column(String)  # 프로필 이미지 경로
# counselor_name = Column(String)  # 상담사 이름
# hash_tags = Column(String)  # 상담사 해시태그
# short_info = Column(String)  # 한줄 소개
# num_of_reviews = Column(Integer)  # 후기 개수
# star_ratio = Column(Float)  # 별점
# profession_part = Column(String)  # 전문의 파트
# introduction = Column(String)  # 소개 및 철학
# counsel_info = Column(String)  # 상담 방법 및 일정
# counselor_history = Column(String)  # 약력
# phone_number = Column(String)
# X_id = Column(String)  # X(구 트위터) 아이디
# insta_id = Column(String)  # 인스타 아이디
# email_address = Column(String)  # 이메일 주소
# counsel_date = Column(Date)  # 상담 날짜
# counsel_type = Column(String)  # 상담 유형
# address = Column(String)  # 상담지 주소
# counsel_price = Column(Integer)  # 상담 가격

# # Relationships
# reviews = relationship("Review", back_populates="counselor")  # 리뷰들


hash_tags_samples = [
    "#번아웃 #직장생활",
    "#부부관계 #인간관계 #번아웃",
    "#식이장애 #자존감 #번아웃",
]
short_info_samples = [
    "진정성 있는 상담을 드립니다.",
    "당신의 마음을 헤아려 드립니다.",
    "당신의 삶에 빛이 되어 드리겠습니다.",
]
long_intro = """안녕하세요 ! 저는 다양한 분들의 심리적 안정을 도와 드리고 있습니다. 특히 학교나 직장 내의 인간 관계로 인한 스트레스를 겪으시거나 번아웃 증상이 있으신 분들을 주로 상담하고 있습니다. 저는 내담자분들의 이야기에 귀 기울이며, 그들의 감정과 생각을 존중하는 것을 최우선으로 합니다. 각 개인의 독특한 경험과 배경을 고려하여 맞춤형 상담을 제공하고자 노력하고 있습니다."""
long_counsel_info = """
⦁  대면 상담 : 진주 마음클리닉에서 진행 
⦁  비대면(온라인) 상담 : Zoom을 통한 비대면 상담 ✔ 비대면 상담 시 카메라, 마이크가 필요합니다.
⦁  월요일~금요일 : 오전 10시 - 오후 6시
⦁  토요일 : 오전 10시 - 오후 2시 
⦁  30분 및 1시간 세션 선택 가능
"""
sample_history = """
✔ 김상담 경상국립대학교 심리학과 석사
✔ 스트레스 관리 및 번아웃 치료 전문 
✔ 한국 상담심리사 자격증 보유
✔ 10년 이상의 상담 경력
✔ 진주시 심리상담센터 (2013-2018)
✔ 현재 진주 마음클리닉 근무 중
"""


@router.post("/api/counselors")  # 9명까지 생성 예정
async def create_counselor(
    profile_img_path: str,
    counselor_name: str,
    counsel_price: int,
    db: Session = Depends(get_db),
):
    db_counselor = Counselor(
        profile_img_path=profile_img_path,
        counselor_name=counselor_name,
        counsel_price=counsel_price,
        hash_tags=hash_tags_samples[random.randint(0, 2)],
        short_info=short_info_samples[random.randint(0, 2)],
        introduction=long_intro,
        counsel_info=long_counsel_info,
        counselor_history=sample_history,
        num_of_reviews=random.randint(10, 50),
        star_ratio=(random.randint(0, 5) / random.randint(1, 5)),
        profession_part="정신과 전문의",
        phone_number="010-1234-1234",
        email_address="doctor_test@gmail.com",
        X_id="@testX1234",
        insta_id="@doctor_test_1234",
        counsel_type="비대면 상담",
        address="경상남도 진주시 진주대로 501",
        counsel_date=datetime(2024, 8, 7, 14, 0),
    )
    db.add(db_counselor)
    db.commit()
    db.refresh(db_counselor)
    return db_counselor


# Read
@router.get("/api/counselors/{counselor_id}")
async def read_counselor(counselor_id: int, db: Session = Depends(get_db)):
    db_counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    return db_counselor


@router.get("/api/counselors")
async def read_counselors(db: Session = Depends(get_db)):
    counselors = db.query(Counselor).all()
    return counselors
