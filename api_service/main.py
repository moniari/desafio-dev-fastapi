from factories.middlewares.user_auth_middleware_factory import makeUserAuthMiddlewareFactory
from factories.controllers.login_controller_factory import makeLoginControllerFactory
from factories.controllers.stock_controller_factory import makeStockControllerFactory
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from fastapi import Depends, FastAPI
from dtos.login_dto import LoginDto
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

auth_token = APIKeyHeader(name='X-SECRET-1', scheme_name='auth_token')

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
async def makeLogin(body: LoginDto):
    try:
        loginController = makeLoginControllerFactory()
        token = loginController.execute(body)
        if token:
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
async def getStock(symbol: str, token: str = Depends(auth_token)):
    try:
        middleware = makeUserAuthMiddlewareFactory()
        validToken = middleware.execute(token)
        if not validToken:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})
        stockController = makeStockControllerFactory()
        content = stockController.execute(symbol)
        if content:
            return JSONResponse(status_code=200, content=content)
        else:
            return JSONResponse(status_code=404, content={"message": "Symbol not found"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
