import requests
import json
import os

class FileLogBuilderGateway:
    def __init__(self, title):
        self.__auth_service_url = os.getenv("LOG_SERVICE_URL")
        self.__title = title

    def log(self, message):
        try:
            response = requests.post(
                f"{self.__auth_service_url}/log", json={"title": self.__title, "message": message}
            )
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return False
