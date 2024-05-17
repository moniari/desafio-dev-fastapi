class GetStockRequestValidator:
    def validate(self, symbol):
        if not symbol:
            return False
        return True
