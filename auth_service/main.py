from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from base64 import b64decode, b64encode
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI
import os

load_dotenv()

app = FastAPI(
    title=os.getenv("PROJECT_NAME"),
    version=os.getenv("API_VERSION"),
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("API_SERVICE_URL")
    ],
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
        return True
    except Exception as e:
        return False

class LoginRequest(BaseModel):
  username: str
  password: str

@app.post(
    "/login", 
    response_class=JSONResponse,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": {
                        "token": "n845yg27845yt82chn458t7h245t"
                    }
                }
            }
        },
        401: {
            "description": "Unauthorized",
            "content": {
                "application/json": {
                    "example": {"message": "Unauthorized"},
                }
            }
        },
        500: {
            "description": "Internal error",
            "content": {
                "application/json": {
                    "example": {"message": "Internal server error"},
                }
            }
        },
    },
)
async def login_controller(body: LoginRequest):
    try:
        token = get_token(body.username, body.password);
        if not token:
            return JSONResponse(
                status_code=401, content={"message": "Unauthorized"}
            )
        return JSONResponse(
            status_code=200, content={"token": token}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"message": "Internal server error"}
        )

@app.get(
    "/validate-token",
    response_class=JSONResponse,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Valid token"
                    }
                }
            }
        },
        400: {
            "description": "Invalid token",
            "content": {
                "application/json": {
                    "example": {"message": "Invalid token"},
                }
            }
        },
        500: {
            "description": "Internal error",
            "content": {
                "application/json": {
                    "example": {"message": "Internal server error"},
                }
            }
        },
    },
)
async def token_controller(token: str):
    try:
        current_user = decode_token(token)
        if not current_user:
            return JSONResponse(
                status_code=400, content={"message": "Invalid token"}
            )

        return JSONResponse(
               status_code=200, content={"message": "Valid token"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"message": "Internal server error"}
        )
