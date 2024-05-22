import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { FakeData } from "tests/utils/data/fake-data";

export class TokenStorageStub implements TokenStorageInterface {
  public async store(key: string, value: any): Promise<void> {
    return await Promise.resolve();
  }
  public async get(key: string): Promise<any> {
    return await Promise.resolve(FakeData.id());
  }
}
