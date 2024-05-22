from validators.get_stock_request_validator import GetStockRequestValidator
from infra.adapters.stocks_api_adapter import StocksApiAdapter
from services.get_stock_service import GetStockService
from controllers.stock_controller import StockController

def makeStockControllerFactory():
    stock_api_adapter = StocksApiAdapter()
    get_stock_service = GetStockService(stock_api_adapter)
    get_stock_request_validator = GetStockRequestValidator()
    return StockController(get_stock_service, get_stock_request_validator)