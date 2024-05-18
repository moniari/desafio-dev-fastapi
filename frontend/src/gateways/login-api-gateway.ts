import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";

export class LoginApiGateway {
  private readonly loginUrl: string;
  private readonly clientPostRequestSender: ClientPostRequestSenderInterface;

  constructor(
    loginUrl: string,
    clientPostRequestSender: ClientPostRequestSenderInterface
  ) {
    this.loginUrl = loginUrl;
    this.clientPostRequestSender = clientPostRequestSender;
  }

  async login(loginData: LoginDto): Promise<string | null> {
    const response = await this.clientPostRequestSender.post(
      this.loginUrl,
      loginData
    );
    if (response && response.token) {
      return response.token;
    }
    return null;
  }
}
