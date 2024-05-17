from gateways.auth_service_gateway import AuthServiceGateway
from middlewares.user_auth_middleware import UserAuthMiddleware

def makeUserAuthMiddlewareFactory():
    auth_service = AuthServiceGateway()
    return UserAuthMiddleware(auth_service)