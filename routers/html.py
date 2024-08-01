from fastapi import APIRouter, Request, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates


def isLogined(user_id: str):
    try:
        int(user_id)
        if user_id:
            return True
        else:
            return False
    except:
        return False


router = APIRouter(tags=["HTML 연결"])
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

    return templates.TemplateResponse(
        "jack.html", {"request": request, "hello": user_id}
    )


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


@router.get("/counselor_detailed/{counselor_id}", response_class=HTMLResponse)
async def counselor_detailed(
    request: Request, counselor_id: int, user_id: str = Cookie(None)
):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "counselor_detailed.html",
        {"request": request, "current_counselor_id": counselor_id})
#내가 추가한 라우트

@router.get("/ari_talk", response_class=HTMLResponse)
async def ari_talk(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "main2.html", {"request": request, "user_id": user_id}
    )

@router.get("/diary", response_class=HTMLResponse)
async def diary(request: Request, user_id: str = Cookie(None)):
    if not isLogined(user_id):
        return RedirectResponse(url="/")

    return templates.TemplateResponse(
        "main3.html", {"request": request, "user_id": user_id}
    )

@router.get("/iframe_talk", response_class=HTMLResponse)
async def iframeTalk(request: Request, user_id: str = Cookie(None)):

    return templates.TemplateResponse(
        "iframe_talk.html", {"request": request, "user_id": user_id}
    )
