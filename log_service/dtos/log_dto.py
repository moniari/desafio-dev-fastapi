from pydantic import BaseModel

class LogDto(BaseModel):
  title: str
  message: str