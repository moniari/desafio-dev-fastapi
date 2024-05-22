class ValidateTokenRequestValidator:
    def validate(self, token):
        if not token:
            return False
        return True