from fastapi import APIRouter, Depends, HTTPException, Cookie, Form
from api.models import Payment, User, Counselor
from config.database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["결제"])

class CouponCode(BaseModel):
    coupon_code: str

@router.post("/api/check_coupon")
async def check_coupon(coupon: CouponCode):
    VALID_COUPONS = {
        "12345-12345-12345-12345",
        "67890-67890-67890-67890",
        "11111-22222-33333-44444",
    }

    if coupon.coupon_code in VALID_COUPONS:
        print(coupon)
        return {"valid": True}
    else:
        raise HTTPException(status_code=400, detail="Invalid coupon code")

@router.post("/api/payment/{counselor_id}")
async def create_payment_by_user(
    counselor_id: int,
    paid_price: int = Form(...),
    pay_type: int = Form(...),
    user_id: str = Cookie(None),
    db: Session = Depends(get_db),
):
    db_payment = Payment(
        counselor_id=counselor_id,
        paid_user_id=int(user_id),
        is_used=False,
        when_paid=datetime.now(),
        paid_price=paid_price,
        pay_type=pay_type,
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/api/payment")
async def read_payments_by_user(
    user_id: str = Cookie(None), db: Session = Depends(get_db)
):
    payments = db.query(Payment).filter(Payment.paid_user_id == int(user_id)).all()
    result = []
    for payment in payments:
        counselor = db.query(Counselor).filter(Counselor.id == payment.counselor_id).first()
        result.append({
            "id": payment.id,
            "counselor_name": counselor.counselor_name if counselor else "Unknown",
            "paid_price": payment.paid_price,
            "is_used": payment.is_used,
            "when_paid": payment.when_paid,
            "counsel_date": counselor.counsel_date if counselor else None,
            "username": db.query(User).filter(User.id == payment.paid_user_id).first().username,
            "counselor_id": counselor.id
        })
    result.sort(key=lambda x:x["is_used"], reverse=True)
    return result

@router.patch("/api/payment/{payment_id}")
async def update_payment_is_used(
    payment_id: int,
    is_used: bool,
    user_id: str = Cookie(None),
    db: Session = Depends(get_db),
):
    db_payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id, Payment.paid_user_id == int(user_id))
        .first()
    )
    if db_payment:
        db_payment.is_used = is_used
        db.commit()
        db.refresh(db_payment)
        return db_payment
    else:
        raise HTTPException(status_code=404, detail="Payment not found")

# 예시 데이터 생성 함수
def create_example_payments(db: Session):
    # 예시 유저 데이터
    user1 = db.query(User).filter(User.username == "박승현").first()
    if not user1:
        user1 = User(
            username="박승현",
            phonenumber="010-5678-1234",
            pincode="1234",
            age=30,
            job="회사원",
            goal="스트레스 관리",
            signup_date=datetime(2024, 7, 2)
        )
        db.add(user1)
        db.commit()
        db.refresh(user1)

    # 예시 상담사 데이터
    counselor1 = db.query(Counselor).filter(Counselor.counselor_name == "최우식").first()
    if not counselor1:
        counselor1 = Counselor(
            counselor_name="최우식",
            counsel_price=12500,
            profile_img_path="path/to/profile1.jpg",
            hash_tags="#자아찾기 #직장생활",
            short_info="진정성 있는 상담을 드립니다.",
            introduction="안녕하세요! 저는 다양한 분들의 심리적 안정을 도와 드리고 있습니다.",
            counsel_info="""
            ⦁ 대면 상담 : 진주 마음클리닉에서 진행
            ⦁ 비대면(온라인) 상담 : Zoom을 통한 비대면 상담
            """,
            counselor_history="""
            ✔ 경상국립대학교 심리학과 석사
            ✔ 스트레스 관리 및 번아웃 치료 전문
            """,
            num_of_reviews=20,
            star_ratio=4.5,
            profession_part="정신과 전문의",
            phone_number="010-1234-1234",
            email_address="choi@example.com",
            X_id="@choiX1234",
            insta_id="@choi_insta",
            counsel_type="비대면 상담",
            address="경상남도 진주시 진주대로 501",
            counsel_date=datetime(2024, 7, 18, 14, 0)
        )
        db.add(counselor1)
        db.commit()
        db.refresh(counselor1)

    # 예시 결제 데이터
    payment1 = Payment(
        counselor_id=counselor1.id,
        paid_user_id=user1.id,
        is_used=True,
        when_paid=datetime(2024, 7, 16, 10, 0),
        paid_price=12500,
        pay_type=1
    )
    db.add(payment1)
    db.commit()
    db.refresh(payment1)

    payment2 = Payment(
        counselor_id=counselor1.id,
        paid_user_id=user1.id,
        is_used=False,
        when_paid=datetime(2024, 7, 20, 15, 30),
        paid_price=13800,
        pay_type=2
    )
    db.add(payment2)
    db.commit()
    db.refresh(payment2)

    return {"message": "예시 결제 데이터가 성공적으로 생성되었습니다."}

@router.get("/api/create_example_payments")
async def create_payments(db: Session = Depends(get_db)):
    return create_example_payments(db)
