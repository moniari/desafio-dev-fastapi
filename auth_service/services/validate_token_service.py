class ValidateTokenService:
    def __init__(self, token_adapter):
        self.__token_adapter = token_adapter

    def execute(self, token):
        return self.__token_adapter.validate_token(token)
