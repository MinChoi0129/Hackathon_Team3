from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

######################## 유저 ########################


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)  # 유저 이름
    phonenumber = Column(String, unique=True, nullable=False)  # 유저 전화번호
    pincode = Column(String, nullable=False)  # 핀 번호
    age = Column(Integer)  # 나이
    job = Column(String)  # 직업
    goal = Column(String)  # 목표
    signup_date = Column(Date)  # 가입일

    # Relationships
    diaries = relationship("Diary", back_populates="user")  # 일기들
    payments = relationship("Payment", back_populates="user")  # 결제들
    conversations = relationship("Conversation", back_populates="user")  # 대화들


######################## 상담사 ########################


class Counselor(Base):
    __tablename__ = "counselors"

    id = Column(Integer, primary_key=True)
    profile_img_path = Column(String)  # 프로필 이미지 경로
    counselor_name = Column(String)  # 상담사 이름
    hash_tags = Column(String)  # 상담사 해시태그
    short_info = Column(String)  # 한줄 소개
    num_of_reviews = Column(Integer)  # 후기 개수
    star_ratio = Column(Float)  # 별점

    profession_part = Column(String)  # 전문의 파트
    introduction = Column(String)  # 소개 및 철학
    counsel_info = Column(String)  # 상담 방법 및 일정
    counselor_history = Column(String)  # 약력
    phone_number = Column(String)
    X_id = Column(String)  # X(구 트위터) 아이디
    insta_id = Column(String)  # 인스타 아이디
    email_address = Column(String)  # 이메일 주소

    counsel_date = Column(Date)  # 상담 날짜
    counsel_type = Column(String)  # 상담 유형
    address = Column(String)  # 상담지 주소
    counsel_price = Column(Integer)  # 상담 가격

    # Relationships
    reviews = relationship("Review", back_populates="counselor")  # 리뷰들


######################## 리뷰 ########################


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    review_text = Column(String, nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.id"))

    # Relationships
    counselor = relationship("Counselor", back_populates="reviews")


######################## 결제 ########################


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    paid_user_id = Column(Integer, ForeignKey("users.id"))  # 결제자 id
    counselor_id = Column(Integer, ForeignKey("counselors.id"))
    is_used = Column(Boolean)  # 상담 완료 여부
    when_paid = Column(Date)  # 결제 일시
    paid_price = Column(Integer)  # 결제 금액
    pay_type = Column(Integer)  # 결제 수단(카페, 네페, 토페)

    user = relationship("User", back_populates="payments")


######################## 대화 ########################


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    conversation_user_id = Column(Integer, ForeignKey("users.id"))  # 대화한 유저 id
    date = Column(Date)

    # Relationships
    user = relationship("User", back_populates="conversations")
    conversation_string_list = relationship(
        "ConversationString", back_populates="conversation"
    )


######################## 대화 문장 ########################


class ConversationString(Base):
    __tablename__ = "conversation_strings"

    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    who_said = Column(String)

    # Relationships
    conversation = relationship(
        "Conversation", back_populates="conversation_string_list"
    )


######################## 일기 ########################


class Diary(Base):
    __tablename__ = "diaries"

    id = Column(Integer, primary_key=True)
    diary_user_id = Column(Integer, ForeignKey("users.id"))  # 일기 쓴 유저 id
    diary_string = Column(String)  # 일기 내용
    date = Column(Date)  # 일기 쓴 날짜

    # Relationships
    user = relationship("User", back_populates="diaries")
