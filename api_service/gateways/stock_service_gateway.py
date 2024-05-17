import requests
import os

class StockServiceGateway:
    def __init__(self):
        self.__stock_service_url = os.getenv("STOCK_SERVICE_URL")

    def get_stock(self, symbol):
        response = requests.get(f"{self.__stock_service_url}/stock?symbol={symbol}")
        if response.status_code != 200:
            return False
        return response.json()
