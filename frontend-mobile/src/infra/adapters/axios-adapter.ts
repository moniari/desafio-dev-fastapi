import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { ClientGetRequestSenderInterface } from "src/domain/abstract/adapters/client-get-request-sender-interface";
import axios from "axios";

export class AxiosAdapter
  implements
    ClientPostRequestSenderInterface,
    ClientGetRequestSenderInterface
{
  public async post(url: string, data: any, authToken?: string): Promise<any> {
    const response = await axios.post(url, data, {
      validateStatus: () => true,
      headers: {
        authorization: `Basic ${authToken}`,
      },
    });
    return response.data;
  }

  public async get(url: string, authToken?: string): Promise<any> {
    const response = await axios.get(url, {
      validateStatus: () => true,
      headers: {
        authorization: `Basic ${authToken}`,
      },
    });
    return response.data;
  }
}
