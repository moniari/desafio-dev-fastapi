import { makeFakeStockEntity } from "tests/utils/data/entities/stock/fake-stock-entity";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { StockEntity } from "src/domain/abstract/entities/stock-entity";

export class GetStockByNameUseCaseStub extends GetStockByNameUseCase {
  public override async execute(id: string): Promise<StockEntity | Error> {
    return makeFakeStockEntity();
  }
}
