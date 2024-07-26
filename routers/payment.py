# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel

# router = APIRouter()


# class CouponCode(BaseModel):
#     coupon_code: str


# @router.post("/api/check_coupon")
# async def check_coupon(coupon: CouponCode):
#     VALID_COUPONS = {
#         "12345-12345-12345-12345",
#         "67890-67890-67890-67890",  
#         "11111-22222-33333-44444",
#     }

#     if coupon.coupon_code in VALID_COUPONS:
#         print(coupon)
#         return {"valid": True}
#     else:
#         raise HTTPException(status_code=400, detail="Invalid coupon code")
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from config.database import SessionLocal
import api.models as models

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
)

# 데이터베이스 세션 종속성 설정
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic 모델 정의 (요청 바디 검증을 위해 사용)
class PaymentCreate(BaseModel):
    QR_img_path: str
    paid_user_id: int
    is_used: bool
    when_paid: Optional[str] = None  # Optional 필드

class Payment(PaymentCreate):
    id: int

    class Config:
        from_attributes = True  # ORM 객체를 Pydantic 모델로 변환할 수 있도록 설정

# 결제 생성 엔드포인트 (QR코드 포함)
@router.post("/", response_model=Payment)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    db_payment = models.Payment(**payment.dict())  # 요청 바디를 사용해 Payment 객체 생성
    db.add(db_payment)  # 데이터베이스 세션에 추가
    db.commit()  # 변경사항 커밋
    db.refresh(db_payment)  # 최신 상태로 갱신
    return db_payment  # 생성된 결제 정보 반환

# 예약 내역 조회 엔드포인트 (상담 완료 표시)
@router.get("/", response_model=List[Payment])
def read_payments(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    payments = db.query(models.Payment).offset(skip).limit(limit).all()  # 결제 정보 쿼리
    return payments  # 결제 정보 리스트 반환

# 특정 예약 내역 조회 (ID 기준)
@router.get("/{payment_id}", response_model=Payment)
def read_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()  # 특정 결제 정보 쿼리
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")  # 결제 정보가 없을 경우 예외 발생
    return payment  # 결제 정보 반환

# 예약 변경 엔드포인트 (ID 기준)
@router.put("/{payment_id}", response_model=Payment)
def update_payment(payment_id: int, payment: PaymentCreate, db: Session = Depends(get_db)):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()  # 특정 결제 정보 쿼리
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")  # 결제 정보가 없을 경우 예외 발생
    
    for key, value in payment.dict().items():
        setattr(db_payment, key, value)  # 결제 정보 업데이트
    
    db.commit()  # 변경사항 커밋
    db.refresh(db_payment)  # 최신 상태로 갱신
    return db_payment  # 업데이트된 결제 정보 반환

# 예약 취소 엔드포인트 (ID 기준)
@router.delete("/{payment_id}", response_model=Payment)
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()  # 특정 결제 정보 쿼리
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")  # 결제 정보가 없을 경우 예외 발생
    
    db.delete(db_payment)  # 결제 정보 삭제
    db.commit()  # 변경사항 커밋
    return db_payment  # 삭제된 결제 정보 반환









