import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { LoginApiInterface } from "src/domain/abstract/gateways/login-api-interface";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { ApiError } from "src/domain/errors/api-error";

export class LoginApiGateway implements LoginApiInterface {
  private readonly loginUrl: string;
  private readonly clientPostRequestSender: ClientPostRequestSenderInterface;

  public constructor(
    loginUrl: string,
    clientPostRequestSender: ClientPostRequestSenderInterface
  ) {
    this.loginUrl = loginUrl;
    this.clientPostRequestSender = clientPostRequestSender;
  }

  public async execute(loginData: LoginDto): Promise<string | null | Error> {
    const response = await this.clientPostRequestSender.post(this.loginUrl, {
      username: loginData.email,
      password: loginData.password,
    });
    if (response && response.token) {
      return response.token;
    }
    if (response && response.message) {
      return new ApiError(response.message);
    }
    return null;
  }
}
