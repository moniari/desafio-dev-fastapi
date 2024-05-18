import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { LoginApiInterface } from "src/domain/abstract/gateways/login-api-interface";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { DefaultError } from "src/domain/errors/default-error";

export class LoginUseCase {
  private readonly loginApi: LoginApiInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    loginApi: LoginApiInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.loginApi = loginApi;
    this.tokenStorage = tokenStorage;
  }

  public async execute(input: LoginDto): Promise<boolean | Error> {
    const token = await this.loginApi.execute(input);
    if (token) {
      await this.tokenStorage.store("token", token);
      return true;
    } else {
      return new DefaultError();
    }
  }
}
