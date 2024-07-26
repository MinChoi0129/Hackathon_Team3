from fastapi import APIRouter, Form, Response, Depends, HTTPException, Request, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from api.models import User, Conversation, Diary, Payment, Counselor
from config.database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import re


def isLogined(user_id: str):
    try:
        int(user_id)
        if user_id:
            return True
        else:
            return False
    except:
        return False


router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
async def landing(
    request: Request, login_error: bool = False, user_id: str = Cookie(None)
):
    if isLogined(user_id):
        return RedirectResponse(url="/main")
    else:
        return templates.TemplateResponse(
            "landing.html", {"request": request, "login_error": login_error}
        )


@router.get("/main", response_class=HTMLResponse)
async def main(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse("main.html", {"request": request})


@router.get("/my_page", response_class=HTMLResponse)
async def my_page(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse("my_page.html", {"request": request})


@router.get("/payment", response_class=HTMLResponse)
async def payment(request: Request, counselor_item: int, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "payment.html",
        {"request": request, "counselor_item": counselor_item},
    )


@router.get("/payment_over", response_class=HTMLResponse)
async def payment_over(
    request: Request, counselor_item: int, user_id: str = Cookie(None)
):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "payment_over.html",
        {"request": request, "counselor_item": counselor_item},
    )


@router.get("/jack", response_class=HTMLResponse)
async def jack(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse("jack.html", {"request": request})


@router.get("/monthreport", response_class=HTMLResponse)
async def monthreport(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse("monthreport.html", {"request": request})


@router.get("/counselors_list", response_class=HTMLResponse)
async def counselors_list(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse("counselors_list.html", {"request": request})


@router.get("/counselor_detailed", response_class=HTMLResponse)
async def counselor_detailed(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse("counselor_detailed.html", {"request": request})
