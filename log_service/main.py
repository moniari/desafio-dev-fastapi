from infra.adapters.file_logger_adapter import FileLoggerAdapter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dtos.log_dto import LogDto
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
        os.getenv("API_SERVICE_URL"),
        os.getenv("AUTH_SERVICE_URL"),
        os.getenv("STOCK_SERVICE_URL")
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post(
    "/log",
    response_class=JSONResponse,
    responses={
        200: {
            "description": "OK",
            "content": {
                "application/json": {
                    "example": {"message": "Log created"},
                }
            },
        },
        500: {
            "description": "Internal error",
            "content": {
                "application/json": {
                    "example": {"message": "Internal server error"},
                }
            },
        }
    },
)
async def createLog(body: LogDto):
    fileLogger = FileLoggerAdapter()
    fileLogger.log(body.title, body.message)
    return JSONResponse(status_code=200, content = {"message": "Log created"})