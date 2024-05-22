class StockController:
    def __init__(self, get_stock_service, get_stock_request_validator):
        self.__get_stock_service = get_stock_service
        self.__get_stock_request_validator = get_stock_request_validator

    def execute(self, symbol):
        if not self.__get_stock_request_validator.validate(symbol):
            return False
        stock = self.__get_stock_service.execute(symbol)
        price = stock["price"]
        if price == 'N/D':
            return False
        return stock
