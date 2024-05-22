class UserAuthMiddleware:
    def __init__(self, auth_service):
        self.__auth_service = auth_service
    
    def execute(self, token):
        return self.__auth_service.validate_token(token)
