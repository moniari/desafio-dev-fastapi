import { ClientGetRequestSenderInterface } from "src/domain/abstract/adapters/client-get-request-sender-interface";
import { StockPriceApiInterface } from "src/domain/abstract/gateways/stock-price-api-interface";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";
import { ApiError } from "src/domain/errors/api-error";

export class StockPriceApiGateway implements StockPriceApiInterface {
  private readonly apiUrl: string;
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;

  public constructor(
    apiUrl: string,
    clientGetRequestSender: ClientGetRequestSenderInterface
  ) {
    this.apiUrl = apiUrl;
    this.clientGetRequestSender = clientGetRequestSender;
  }

  public async execute(
    symbol: string,
    authToken: string
  ): Promise<StockInfoDto | null | Error> {
    const response = await this.clientGetRequestSender.get(
      `${this.apiUrl}?q=${symbol}`,
      authToken
    );
    if (
      response &&
      response.cotacao &&
      response.nome_da_empresa &&
      response.simbolo
    ) {
      return response;
    }
    if (response && response.message) {
      return new ApiError(response.message);
    }
    return null;
  }
}
