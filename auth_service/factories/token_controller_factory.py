from validators.validate_token_request_validator import ValidateTokenRequestValidator
from services.validate_token_service import ValidateTokenService
from controllers.token_controller import TokenController
from infra.adapters.token_adapter import TokenAdapter

def makeTokenControllerFactory():
    token_adapter = TokenAdapter()
    validate_token_service = ValidateTokenService(token_adapter)
    validate_token_request_validator = ValidateTokenRequestValidator()
    return TokenController(validate_token_service, validate_token_request_validator)
