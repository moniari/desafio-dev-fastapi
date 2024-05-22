import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { FakeData } from "tests/utils/data/fake-data";

export class ClientPostRequestSenderStub
  implements ClientPostRequestSenderInterface
{
  public async post(url: string, data: any, authToken?: string): Promise<any> {
    return FakeData.object();
  }
}
