from dtos.login_dto import LoginDto

class LoginController:
    def __init__(self, make_login_service, make_login_request_validator):
        self.__make_login_service = make_login_service
        self.__make_login_request_validator = make_login_request_validator

    def execute(self, request: LoginDto):
        if not self.__make_login_request_validator.validate(request):
            return False
        return self.__make_login_service.execute(request.username, request.password)
