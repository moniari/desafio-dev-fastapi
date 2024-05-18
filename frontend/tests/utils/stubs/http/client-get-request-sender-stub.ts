import { ClientGetRequestSenderInterface } from "src/domain/abstract/adapters/client-get-request-sender-interface";
import { FakeData } from "tests/utils/data/fake-data";

export class ClientGetRequestSenderStub
  implements ClientGetRequestSenderInterface
{
  public async get(url: string, authToken?: string): Promise<any> {
    return FakeData.object();
  }
}
