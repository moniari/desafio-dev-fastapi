
import requests
import csv

class StocksApiAdapter:
    def get_stock(self, symbol):
        url = f"https://stooq.com/q/l/?s={symbol}&f=sd2t2ohlcvn&h&e=csv"
        response = requests.get(url)
        response.raise_for_status()
        reader = csv.reader(response.text.splitlines())
        row = next(reader)
        row = next(reader)
        name = row[8]
        price = row[6]
        return {
            "symbol": symbol,
            "name": name,
            "price": price
        }