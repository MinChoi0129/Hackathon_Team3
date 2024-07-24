from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# static 폴더 연결
app.mount("/static", StaticFiles(directory="static"), name="static")

# templates 폴더 연결
templates = Jinja2Templates(directory="templates")


# HTML 연결
@app.get("/", response_class=HTMLResponse)
async def main(request: Request):
    return templates.TemplateResponse(request=request, name="main.html")


@app.get("/my_page", response_class=HTMLResponse)
async def my_page(request: Request):
    return templates.TemplateResponse(request=request, name="my_page.html")

@app.get("/counselors_list", response_class=HTMLResponse)
async def counselors_list(request: Request):
    return templates.TemplateResponse(request=request, name="counselors_list.html")

@app.get("/counselor_detailed", response_class=HTMLResponse)
async def counselor_detailed(request: Request):
    return templates.TemplateResponse(request=request, name="counselor_detailed.html")

# API 연결
# (추후 개발)
@app.get("/api/counselor_list", response_class=HTMLResponse)
async def counselor_list(request: Request):
    return {}