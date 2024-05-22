import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";
import { FakeData } from "../../fake-data";

export const makeFakeStockInfoDto = (): StockInfoDto => ({
  simbolo: FakeData.word(),
  nome_da_empresa: FakeData.phrase(),
  cotacao: FakeData.numberFloat(),
});
