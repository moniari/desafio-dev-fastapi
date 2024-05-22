from base64 import b64decode, b64encode
import os

class TokenAdapter:
    def create_token(self, username, password):
        correct_username = os.getenv("USERNAME")
        correct_password = os.getenv("PASSWORD")
        if not (username == correct_username and password == correct_password):
            return False
        encoded = b64encode(f"{username}:{password}".encode()).decode("utf-8")
        return encoded
    
    def validate_token(self, token):
        try:
            decoded = b64decode(token).decode("utf-8")
            username, password = decoded.split(":")
            if not (username and password):
                return False
            if not (username == os.getenv("USERNAME") and password == os.getenv("PASSWORD")):
                return False
            return True
        except Exception as e:
            return False
