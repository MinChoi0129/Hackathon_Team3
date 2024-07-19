from fastapi import FastAPI, Request, Form, Cookie, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import HTTPException
from starlette.status import HTTP_302_FOUND
from urllib.parse import quote, unquote

app = FastAPI()

# static 폴더 연결
app.mount("/static", StaticFiles(directory="static"), name="static")

# templates 폴더 연결
templates = Jinja2Templates(directory="templates")

# 간단한 유저 데이터
users = {
    "010-7440-1538": ["이민재", 7707],
}


@app.get("/", response_class=HTMLResponse)
async def landing(
    request: Request, login_error: bool = False, username: str = Cookie(None)
):
    try:
        tmp_username = unquote(username)
        if tmp_username:
            return RedirectResponse(url="/main")
    except:  # 쿠키 없음(새 세션)
        pass
    return templates.TemplateResponse(
        "landing.html", {"request": request, "login_error": login_error}
    )


@app.get("/main", response_class=HTMLResponse)
async def main(request: Request, username: str = Cookie(None)):
    return templates.TemplateResponse(
        "main.html", {"request": request, "username": username}
    )


@app.get("/payment", response_class=HTMLResponse)
async def payment(request: Request, counselor_item: int, username: str = Cookie(None)):
    return templates.TemplateResponse(
        "payment.html",
        {"request": request, "username": username, "counselor_item": counselor_item},
    )


@app.post("/login")
async def login(
    response: Response,
    request: Request,
    username: str = Form(...),
    phonenumber: str = Form(...),
    PINCode: int = Form(...),
):
    if phonenumber not in users:
        print("신규유저입니다. 유저 생성", username, phonenumber, PINCode)
        users[phonenumber] = [username, PINCode]

    else:
        print("기존유저", phonenumber)
        if [username, PINCode] == users.get(phonenumber):
            response = RedirectResponse(url="/main", status_code=HTTP_302_FOUND)
            encoded_value = quote(username)  # 한글을 URL 인코딩
            response.set_cookie(key="username", value=encoded_value)
            return response
        else:
            response = RedirectResponse(url="/", status_code=HTTP_302_FOUND)
            response.set_cookie(key="login_error", value=True)
            return response


@app.post("/logout")
async def logout(response: Response):
    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie(key="username")
    return response
