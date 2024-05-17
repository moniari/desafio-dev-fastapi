from dtos.login_dto import LoginDto

class LoginController:
    def __init__(self, auth_service, make_login_request_validator):
        self.__auth_service = auth_service
        self.__make_login_request_validator = make_login_request_validator

    def execute(self, request: LoginDto):
        if not self.__make_login_request_validator.validate(request):
            return False
        return self.__auth_service.create_token(request.username, request.password)
