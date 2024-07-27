from fastapi import APIRouter, Request, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from urllib.parse import unquote


def isLogined(username):
    try:
        tmp_username = unquote(username)
        if tmp_username:
            return True
    except:
        return False


router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
async def landing(
    request: Request, login_error: bool = False, username: str = Cookie(None)
):
    if isLogined(username):
        return RedirectResponse(url="/main")
    else:
        return templates.TemplateResponse(
            "landing.html", {"request": request, "login_error": login_error}
        )


@router.get("/main", response_class=HTMLResponse)
async def main(request: Request, username: str = Cookie(None)):
    if not isLogined(username):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "main.html", {"request": request, "username": username}
    )


@router.get("/my_page", response_class=HTMLResponse)
async def my_page(request: Request, username: str = Cookie(None)):
    if not isLogined(username):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "my_page.html", {"request": request, "username": username}
    )


@router.get("/payment", response_class=HTMLResponse)
async def payment(request: Request, counselor_item: int, username: str = Cookie(None)):
    if not isLogined(username):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "payment.html",
        {"request": request, "username": username, "counselor_item": counselor_item},
    )


@router.get("/payment_over", response_class=HTMLResponse)
async def payment(request: Request, counselor_item: int, username: str = Cookie(None)):
    if not isLogined(username):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "payment_over.html",
        {"request": request, "username": username, "counselor_item": counselor_item},
    )


@router.get("/jack", response_class=HTMLResponse)
async def jack(request: Request, username: str = Cookie(None)):
    if not isLogined(username):
        return RedirectResponse(url="/")
    return templates.TemplateResponse(request=request, name="jack.html")


@router.get("/monthreport", response_class=HTMLResponse)
async def monthreport(request: Request, username: str = Cookie(None)):
    if not isLogined(username):
        return RedirectResponse(url="/")
    return templates.TemplateResponse(request=request, name="monthreport.html")


@router.get("/counselors_list", response_class=HTMLResponse)
async def counselors_list(request: Request):
    return templates.TemplateResponse(request=request, name="counselors_list.html")


@router.get("/counselor_detailed", response_class=HTMLResponse)
async def counselor_detailed(request: Request):
    return templates.TemplateResponse(request=request, name="counselor_detailed.html")
