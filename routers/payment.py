from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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
