import { StockPriceApiInterface } from "src/domain/abstract/gateways/stock-price-api-interface";
import { makeFakeStockInfoDto } from "tests/utils/data/dtos/stock/fake-stock-info-dto";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";

export class StockPriceApiGatewayStub implements StockPriceApiInterface {
  public async execute(
    symbol: string,
    authToken: string
  ): Promise<StockInfoDto | null | Error> {
    return makeFakeStockInfoDto();
  }
}
