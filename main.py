from fastapi import FastAPI, Request, Form, Cookie, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import HTTPException
from starlette.status import HTTP_302_FOUND

app = FastAPI()

# static 폴더 연결
app.mount("/static", StaticFiles(directory="static"), name="static")

# templates 폴더 연결
templates = Jinja2Templates(directory="templates")

# 간단한 유저 데이터
users = {
    "aa": "bb",
}


@app.get("/", response_class=HTMLResponse)
async def landing(
    request: Request, login_error: bool = False, username: str = Cookie(None)
):
    if username:
        response = RedirectResponse(url="/main", status_code=HTTP_302_FOUND)
        return response
    else:
        return templates.TemplateResponse(
            "landing.html", {"request": request, "login_error": login_error}
        )


@app.get("/main", response_class=HTMLResponse)
async def main(request: Request, username: str = Cookie(None)):
    return templates.TemplateResponse(
        "main.html", {"request": request, "username": username}
    )


@app.post("/login")
async def login(
    response: Response,
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
):
    if users.get(username) == password:
        response = RedirectResponse(url="/main", status_code=HTTP_302_FOUND)
        response.set_cookie(key="username", value=username)
        return response
    else:
        response = RedirectResponse(url="/", status_code=HTTP_302_FOUND)
        response.set_cookie(key="login_error", value="true")
        return response


@app.post("/logout")
async def logout(response: Response):
    response = RedirectResponse(url="/", status_code=302)
    response.delete_cookie(key="username")
    return response
