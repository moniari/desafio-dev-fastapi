import { LoginApiInterface } from "src/domain/abstract/gateways/login-api-interface";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { FakeData } from "tests/utils/data/fake-data";

export class LoginApiGatewayStub implements LoginApiInterface {
  public async execute(loginData: LoginDto): Promise<string | null | Error> {
    return FakeData.word();
  }
}
