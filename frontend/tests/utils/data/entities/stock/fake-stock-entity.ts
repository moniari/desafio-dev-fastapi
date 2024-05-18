import { StockEntity } from "src/domain/abstract/entities/stock-entity";
import { FakeData } from "tests/utils/data/fake-data";

export const makeFakeStockEntity = (): StockEntity => ({
  symbol: FakeData.word(),
});
