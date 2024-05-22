class MakeLoginRequestValidator:
    def validate(self, request):
        if not request.username or not request.password:
            return False
        return True