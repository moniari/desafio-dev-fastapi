from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from fastapi import Depends, FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
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

auth_service_url = os.getenv("AUTH_SERVICE_URL")
stock_service_url = os.getenv("STOCK_SERVICE_URL")

auth_token = APIKeyHeader(name='X-SECRET-1', scheme_name='auth_token')

def validate_token(token):
    try:
        if not token.startswith('Basic '):
            return False
        formated_token = token.replace('Basic ', '') 
        response = requests.get(f"{auth_service_url}/validate-token?token={formated_token}")
        if response.status_code == 200:
            return True
        else:
            return False
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
        response = requests.post(f"{auth_service_url}/login", json={"username": body.username, "password": body.password})
        if response.status_code == 200:
            token = response.json().get("token")
            return JSONResponse(status_code=200, content={"token": token})
        else:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

@app.get(
    "/stock",
    response_class=JSONResponse,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": {
                        "simbolo": "AACG.US",
                        "nome_da_empresa": "ATA CREATIVITY GLOBAL",
                        "cotacao": 0.9143,
                    }
                }
            }
        },
        404: {
            "description": "Symbol not found",
            "content": {
                "application/json": {
                    "example": {"message": "Symbol not found"},
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
async def get_stock_controller(symbol: str, token: str = Depends(auth_token)):
    try:
        if not validate_token(token):
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        response = requests.get(f"{stock_service_url}/stock?symbol={symbol}")
        if response.status_code == 200:
            return JSONResponse(status_code=200, content=response.json())
        else:
            return JSONResponse(status_code=404, content={"message": "Symbol not found"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
