import { StockPriceApiInterface } from "src/domain/abstract/gateways/stock-price-api-interface";
import { TokenStorageInterface } from "../../abstract/adapters/token-storage-interface";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";
import { DefaultError } from "../../errors/default-error";

export class GetStockByNameUseCase {
  private readonly stockPriceApi: StockPriceApiInterface;
  private readonly tokenStorage: TokenStorageInterface;

  public constructor(
    stockPriceApi: StockPriceApiInterface,
    tokenStorage: TokenStorageInterface
  ) {
    this.stockPriceApi = stockPriceApi;
    this.tokenStorage = tokenStorage;
  }

  public async execute(stockName: string): Promise<StockInfoDto | Error> {
    const token = await this.tokenStorage.get("token");
    if (!token) {
      return new DefaultError();
    }
    const data = await this.stockPriceApi.execute(stockName, token);
    if (!data) {
      return new DefaultError();
    } else {
      return data;
    }
  }
}
