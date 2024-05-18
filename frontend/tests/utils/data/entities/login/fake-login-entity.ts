import { LoginEntity } from "src/domain/abstract/entities/login-entity";
import { FakeData } from "tests/utils/data/fake-data";

export const makeFakeLoginEntity = (): LoginEntity => ({
  email: FakeData.email(),
  password: FakeData.password(),
});
