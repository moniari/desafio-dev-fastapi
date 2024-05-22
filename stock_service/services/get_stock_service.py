class GetStockService:
    def __init__(self, stock_api_adapter):
        self.__stock_api_adapter = stock_api_adapter

    def execute(self, symbol):
        return self.__stock_api_adapter.get_stock(symbol)
