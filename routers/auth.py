from fastapi import APIRouter, Form, Response, Depends, Cookie
from fastapi.responses import RedirectResponse
from api.models import User
from config.database import get_db
from sqlalchemy.orm import Session
import re


router = APIRouter()


@router.post("/api/login")
async def login(
    response: Response,
    username: str = Form(...),
    phonenumber: str = Form(...),
    PINCode: str = Form(...),
    db: Session = Depends(get_db),
):

    phone_pattern = re.compile(r"^010-\d{4}-\d{4}$")
    pin_pattern = re.compile(r"^\d{4}$")

    if not phone_pattern.match(phonenumber) or not pin_pattern.match(PINCode):
        response = RedirectResponse(url="/", status_code=302)
        response.set_cookie(key="form_error", value=True)

        response.delete_cookie(key="user_id")
        response.delete_cookie(key="login_error")
        response.delete_cookie(key="welcome_new_user")
        return response

    user = db.query(User).filter(User.phonenumber == phonenumber).first()

    if not user:  # 신규유저
        print("신규 유저")
        new_user = User(username=username, phonenumber=phonenumber, pincode=PINCode)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        response = RedirectResponse(url="/main", status_code=302)

        response.set_cookie(key="user_id", value=str(new_user.id))
        response.set_cookie(key="welcome_new_user", value=True)

        response.delete_cookie(key="login_error")
        response.delete_cookie(key="form_error")
        return response
    else:  # 기존 유저
        if user.username == username and user.pincode == PINCode:  # 로그인 성공
            print("기존 유저, 로그인 성공")
            response = RedirectResponse(url="/main", status_code=302)
            response.set_cookie(key="user_id", value=str(user.id))

            response.delete_cookie(key="welcome_new_user")
            response.delete_cookie(key="login_error")
            response.delete_cookie(key="form_error")
            return response
        else:  # 로그인 정보 일치 안함
            print("기존 유저, 로그인 실패")
            response = RedirectResponse(url="/", status_code=302)
            response.set_cookie(key="login_error", value=True)

            response.delete_cookie(key="user_id")
            response.delete_cookie(key="welcome_new_user")
            response.delete_cookie(key="form_error")
            return response


@router.post("/api/logout")
async def logout(response: Response):
    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie(key="user_id")
    response.delete_cookie(key="welcome_new_user")
    response.delete_cookie(key="form_error")
    response.delete_cookie(key="login_error")
    return response


@router.delete("/api/user_delete")
async def delete_user(user_id: str = Cookie(None), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == int(user_id)).first()
    db.delete(db_user)
    db.commit()

    return {"detail": "User deleted successfully"}
