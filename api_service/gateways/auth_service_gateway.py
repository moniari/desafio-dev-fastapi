
import requests
import os

class AuthServiceGateway:
    def __init__(self):
        self.__auth_service_url = os.getenv("AUTH_SERVICE_URL")

    def validate_token(self, token):
        try:
            if not token.startswith('Basic '):
                return False
            formated_token = token.replace('Basic ', '') 
            response = requests.get(f"{self.__auth_service_url}/validate-token?token={formated_token}")
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            return False
        
    def create_token(self, username, password):
        try:
            response = requests.post(f"{self.__auth_service_url}/login", json={"username": username, "password": password})
            if response.status_code == 200:
                return response.json().get("token")
            else:
                return False
        except Exception as e:
            return False
