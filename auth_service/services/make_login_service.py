class MakeLoginService:
    def __init__(self, token_adapter):
        self.__token_adapter = token_adapter

    def execute(self, username, password):
        return self.__token_adapter.create_token(username, password)
    