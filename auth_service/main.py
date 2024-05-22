from factories.login_controller_factory import makeLoginControllerFactory
from factories.token_controller_factory import makeTokenControllerFactory
from gateways.file_log_builder_adapter import FileLogBuilderGateway
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from dtos.login_dto import LoginDto
from dotenv import load_dotenv
from fastapi import FastAPI
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
    allow_origins=[
        os.getenv("API_SERVICE_URL")
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_header = APIKeyHeader(name='X-SECRET-1', scheme_name='secret-header-1')
logger = FileLogBuilderGateway("auth_service")

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
        if not token:
            response = {"message": "Unauthorized"}
            logger.log("RESPONSE => POST /login 401: " + json.dumps(response))
            return JSONResponse(
                status_code=401, content=response
            )
        response = {"token": token}
        logger.log("RESPONSE => POST /login 200: " + json.dumps(response))
        return JSONResponse(
            status_code=200, content=response
        )
    except Exception as e:
        response = {"message": "Internal server error"}
        logger.log("RESPONSE => POST /login 500: " + json.dumps(response) + " " + str(e))
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
async def validateToken(token: str):
    try:
        logger.log("REQUEST => GET /validate-token: " + token)
        tokenController = makeTokenControllerFactory()
        validToken = tokenController.execute(token)
        if not validToken:
            response = {"message": "Invalid token"}
            logger.log("RESPONSE => GET /validate-token 400: " + json.dumps(response))
            return JSONResponse(
                status_code=400, content=response
            )
        response = {"message": "Valid token"}
        logger.log("RESPONSE => GET /validate-token 200: " + json.dumps(response))
        return JSONResponse(
               status_code=200, content=response
        )
    except Exception as e:
        response = {"message": "Internal server error"}
        logger.log("RESPONSE => GET /validate-token 500: " + json.dumps(response) + " " + str(e))
        return JSONResponse(
            status_code=500, content=response
        )
