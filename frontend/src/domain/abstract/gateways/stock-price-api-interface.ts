import { StockInfoDto } from "../dtos/stock/stock-info-dto";

export interface StockPriceApiInterface {
  execute(symbol: string, authToken: string): Promise<StockInfoDto | null>;
}
