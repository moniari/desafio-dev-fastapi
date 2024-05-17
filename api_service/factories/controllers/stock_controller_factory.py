from validators.get_stock_request_validator import GetStockRequestValidator
from gateways.stock_service_gateway import StockServiceGateway
from controllers.stock_controller import StockController

def makeStockControllerFactory():
    stock_service = StockServiceGateway()
    make_stock_request_validator = GetStockRequestValidator()
    return StockController(stock_service,make_stock_request_validator)
