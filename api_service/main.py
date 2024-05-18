from factories.middlewares.user_auth_middleware_factory import makeUserAuthMiddlewareFactory
from factories.controllers.login_controller_factory import makeLoginControllerFactory
from factories.controllers.stock_controller_factory import makeStockControllerFactory
from gateways.file_log_builder_adapter import FileLogBuilderGateway
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from fastapi import Depends, FastAPI
from dtos.login_dto import LoginDto
from dotenv import load_dotenv
import json
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
logger = FileLogBuilderGateway("api_service")

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
        logger.log("REQUEST => POST /login: " + json.dumps(body.__dict__))
        loginController = makeLoginControllerFactory()
        token = loginController.execute(body)
        if token:
            response = {"token": token}
            logger.log("RESPONSE => POST /login 200: " + json.dumps(response))
            return JSONResponse(status_code=200, content=response)
        else:
            response = {"message": "Unauthorized"}
            logger.log("RESPONSE => POST /login 401: " + json.dumps(response))
            return JSONResponse(status_code=401, content=response)
    except Exception as e:
        response = {"message": "Internal server error"}
        print (e)
        logger.log("RESPONSE => POST /login 500: " + json.dumps(response) + " " + str(e))
        return JSONResponse(status_code=500, content=response)

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
        logger.log("REQUEST => GET /stock: " + json.dumps({"symbol": symbol, "token": token}))
        middleware = makeUserAuthMiddlewareFactory()
        validToken = middleware.execute(token)
        if not validToken:
            response = {"message": "Unauthorized"}
            logger.log("RESPONSE => GET /stock 401: " + json.dumps(response))
            return JSONResponse(status_code=401, content=response)
        stockController = makeStockControllerFactory()
        content = stockController.execute(symbol)
        if content:
            logger.log("RESPONSE => GET /stock 200: " + json.dumps(content))
            return JSONResponse(status_code=200, content=content)
        else:
            response = {"message": "Symbol not found"}
            logger.log("RESPONSE => GET /stock 404: " + json.dumps(response))
            return JSONResponse(status_code=404, content=response)
    except Exception as e:
        response = {"message": "Internal server error"}
        logger.log("RESPONSE => GET /stock 500: " + json.dumps(response) + " " + str(e))
        return JSONResponse(status_code=500, content=response)
