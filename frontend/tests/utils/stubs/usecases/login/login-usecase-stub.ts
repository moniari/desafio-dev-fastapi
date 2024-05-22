import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { FakeData } from "tests/utils/data/fake-data";

export class LoginUseCaseStub extends LoginUseCase {
  public override async execute(input: LoginDto): Promise<boolean | Error> {
    return FakeData.bool();
  }
}
