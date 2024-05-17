from validators.make_login_request_validator import MakeLoginRequestValidator
from controllers.login_controller import LoginController
from services.make_login_service import MakeLoginService
from infra.adapters.token_adapter import TokenAdapter

def makeLoginControllerFactory():
    token_adapter = TokenAdapter()
    make_login_service = MakeLoginService(token_adapter)
    make_login_request_validator = MakeLoginRequestValidator()
    return LoginController(make_login_service, make_login_request_validator)