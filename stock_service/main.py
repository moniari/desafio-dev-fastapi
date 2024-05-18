from factories.stock_controller_factory import makeStockControllerFactory
from gateways.file_log_builder_adapter import FileLogBuilderGateway
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

logger = FileLogBuilderGateway("stock_service")

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
async def getStock(symbol: str):
    try:
        logger.log("REQUEST => GET /stock: " + symbol)
        stockController = makeStockControllerFactory()
        stock = stockController.execute(symbol)
        if not stock:
            response = {"message": "Symbol not found"}
            logger.log("RESPONSE => GET /stock 404: " + json.dumps(response))
            return JSONResponse(status_code=404, content=response)
        response = {
            "simbolo": stock["symbol"],
            "nome_da_empresa": stock["name"],
            "cotacao": float(stock["price"]),
        }
        logger.log("RESPONSE => POST /login 200: " + json.dumps(response))
        return JSONResponse(status_code=200, content=response)
    except Exception as e:
        response = {"message": "Internal server error"}
        logger.log("RESPONSE => POST /login 500: " + json.dumps(response) + " " + str(e))
        return JSONResponse(status_code=500, content=response)
