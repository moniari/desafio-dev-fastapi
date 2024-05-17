from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from base64 import b64decode, b64encode
from fastapi import FastAPI, Security
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title=os.getenv("PROJECT_NAME"),
    version=os.getenv("API_VERSION"),
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_header = APIKeyHeader(name='X-SECRET-1', scheme_name='secret-header-1')

def get_token(username, password):
    correct_username = os.getenv("USERNAME")
    correct_password = os.getenv("PASSWORD")

    if not (username == correct_username and password == correct_password):
        return False

    encoded = b64encode(f"{username}:{password}".encode()).decode("utf-8")
    return encoded

def decode_token(token):
    try:
        decoded = b64decode(token).decode("utf-8")
        username, password = decoded.split(":")

        if not (username and password):
            return False
        if not (username == os.getenv("USERNAME") and password == os.getenv("PASSWORD")):
            return False

        return username
    except Exception as e:
        return False

@app.post("/login", response_class=JSONResponse, summary="Login to access the API")
async def login(    
    username: str = '',
    password: str = '',
):
    token = get_token(username, password);

    if not token:
        return JSONResponse(
            status_code=401, content={"message": "Unauthorized"}
        )

    return JSONResponse(
        status_code=200, content={"token": token}
    )


@app.get("/login-test", response_class=JSONResponse)
async def login_test(token=Security(auth_header)):
    current_user = decode_token(token)

    if not current_user:
        return JSONResponse(
            status_code=401, content={"message": "Unauthorized"}
        )

    return JSONResponse(
        status_code=200, content={"message": f"Welcome, {current_user}! You are authorized."}
    )
