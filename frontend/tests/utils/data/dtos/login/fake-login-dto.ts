import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { FakeData } from "tests/utils/data/fake-data";

export const makeFakeLoginDto = (): LoginDto => ({
  email: FakeData.email(),
  password: FakeData.password(),
});
