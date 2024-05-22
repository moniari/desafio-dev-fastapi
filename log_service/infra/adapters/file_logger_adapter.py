import logging
import os

class FileLoggerAdapter:
    def __init__(self):
        self.__logger = logging.getLogger()

    def log(self, title, message):
        self.__logger.name = title
        self.__logger.setLevel(logging.INFO)
        log_dir = os.path.join(os.getcwd(), 'logs')
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        log_file = os.path.join(log_dir, f'{title}.log')
        formatter = logging.Formatter('%(asctime)s / %(name)s / %(message)s')
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        self.__logger.addHandler(file_handler)
        self.__logger.info(f'{title} / {message}')
        print(f'LOG: {title}.log => {message}')
