from factories.stock_controller_factory import makeStockControllerFactory
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
        stockController = makeStockControllerFactory()
        stock = stockController.execute(symbol)
        if not stock:
            return JSONResponse(status_code=404, content={"message": "Symbol not found"})
        return JSONResponse(
            status_code=200,
            content={
                "simbolo": stock["symbol"],
                "nome_da_empresa": stock["name"],
                "cotacao": float(stock["price"]),
            })
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
