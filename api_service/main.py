from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import timedelta
from fastapi import Depends, FastAPI, Security
from dotenv import load_dotenv
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()

app = FastAPI(
    title=os.getenv("PROJECT_NAME"),
    version=os.getenv("API_VERSION"),
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    return "encoded_jwt"


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        return "username"
    except Exception as e:
        return None


@app.post("/login", response_class=JSONResponse, summary="Login to access the API")
async def login(username: str = "", password: str = ""):
    return JSONResponse(status_code=200, content={"token": "access_token"})


@app.get("/stock-data", response_class=JSONResponse)
async def get_stock_data(token: str = Security(oauth2_scheme)):
    # Placeholder for fetching stock data from external service
    # You'll use the token here to authenticate with the stock service
    # ...
    return JSONResponse(status_code=200, content={"message": "Stock Data Placeholder"})
