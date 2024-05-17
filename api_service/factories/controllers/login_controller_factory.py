from validators.make_login_request_validator import MakeLoginRequestValidator
from gateways.auth_service_gateway import AuthServiceGateway
from controllers.login_controller import LoginController

def makeLoginControllerFactory():
    auth_service = AuthServiceGateway()
    make_login_request_validator = MakeLoginRequestValidator()
    return LoginController(auth_service,make_login_request_validator)
