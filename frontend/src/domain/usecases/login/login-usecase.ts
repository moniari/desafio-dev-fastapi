import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { LoginEntity } from "src/domain/abstract/entities/login-entity";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { DefaultError } from "src/domain/errors/default-error";
import { ApiError } from "src/domain/errors/api-error";

export class LoginUseCase {
  private readonly url: string;
  private readonly clientPostRequestSender: ClientPostRequestSenderInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    loginUrl: string,
    clientPostRequestSender: ClientPostRequestSenderInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.url = loginUrl;
    this.clientPostRequestSender = clientPostRequestSender;
    this.tokenStorage = tokenStorage;
  }

  public async execute(input: LoginDto): Promise<LoginEntity | Error> {
    const data = await this.clientPostRequestSender.post(this.url, input);
    if (!data || !data.token) {
      return new DefaultError();
    } else if (data.error) {
      return new ApiError(data.error);
    } else {
      await this.tokenStorage.store("token", data.token);
      return data;
    }
  }
}
