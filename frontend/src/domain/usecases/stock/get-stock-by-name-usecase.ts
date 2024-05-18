import { ClientGetRequestSenderInterface } from "../../abstract/adapters/client-get-request-sender-interface";
import { TokenStorageInterface } from "../../abstract/adapters/token-storage-interface";
import { StockEntity } from "src/domain/abstract/entities/stock-entity";
import { DefaultError } from "../../errors/default-error";
import { ApiError } from "../../errors/api-error";

export class GetStockByNameUseCase {
  private readonly url: string;
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    stockSearchUrl: string,
    clientGetRequestSender: ClientGetRequestSenderInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.url = stockSearchUrl;
    this.clientGetRequestSender = clientGetRequestSender;
    this.tokenStorage = tokenStorage;
  }

  public async execute(stockId: string): Promise<StockEntity | Error> {
    const token = await this.tokenStorage.get("token");
    if (!token) {
      return new DefaultError();
    }
    const data = await this.clientGetRequestSender.get(
      `${this.url}/${stockId}`,
      token
    );
    if (!data) {
      return new DefaultError();
    } else if (data.error) {
      return new ApiError(data.error);
    } else {
      return data;
    }
  }
}
