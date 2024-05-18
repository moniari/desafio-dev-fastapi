import { makeFakeLoginEntity } from "tests/utils/data/entities/login/fake-login-entity";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { LoginEntity } from "src/domain/abstract/entities/login-entity";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";

export class LoginUseCaseStub extends LoginUseCase {
  public override async execute(input: LoginDto): Promise<LoginEntity | Error> {
    return makeFakeLoginEntity();
  }
}
