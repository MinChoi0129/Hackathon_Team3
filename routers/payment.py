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
    counselor_id: int, user_id: str = Cookie(None), db: Session = Depends(get_db)
):
    db_payment = Payment(
        counselor_id=counselor_id,
        paid_user_id=int(user_id),
        is_used=False,
        when_paid=datetime.now(),
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.get("/api/payment")
async def read_payments_by_user(
    user_id: str = Cookie(None), db: Session = Depends(get_db)
):
    return db.query(Payment).filter(Payment.paid_user_id == int(user_id)).all()


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
    db_payment.is_used = is_used
    db.commit()
    db.refresh(db_payment)

    return db_payment
