from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from dotenv import load_dotenv
from fastapi import FastAPI
import requests
import csv
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
            "description": "Simbolo não encontrado",
            "content": {
                "application/json": {
                    "example": {"message": "Simbolo não encontrado"},
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
async def get_stock(symbol: str):
    try:
        url = f"https://stooq.com/q/l/?s={symbol}&f=sd2t2ohlcvn&h&e=csv"
        response = requests.get(url)
        response.raise_for_status()
        reader = csv.reader(response.text.splitlines())
        row = next(reader)
        row = next(reader)
        name = row[8]
        price = row[6]

        if price == 'N/D':
            return JSONResponse(status_code=404, content={"message": "Simbolo não encontrado"})
    
        return JSONResponse(
            status_code=200,
            content={
                "simbolo": symbol,
                "nome_da_empresa": name,
                "cotacao": float(price),
            })
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
