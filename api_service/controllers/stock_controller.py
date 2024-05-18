class StockController:
    def __init__(self, stock_service, get_stock_request_validator):
        self.__stock_service = stock_service
        self.__get_stock_request_validator = get_stock_request_validator

    def execute(self, symbol):
        if not self.__get_stock_request_validator.validate(symbol):
            return False
        stock = self.__stock_service.get_stock(symbol)
        if not stock:
            return False
        price = stock["cotacao"]
        if price == 'N/D':
            return False
        return stock
