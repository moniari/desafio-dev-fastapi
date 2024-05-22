class TokenController:
    def __init__(self, validate_token_service, validate_token_request_validator):
        self.__validate_token_service = validate_token_service
        self.__validate_token_request_validator = validate_token_request_validator

    def execute(self, token: str):
        if not self.__validate_token_request_validator.validate(token):
            return False
        return self.__validate_token_service.execute(token)
