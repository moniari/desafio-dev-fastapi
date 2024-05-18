import { makeFakeStockEntity } from "tests/utils/data/entities/stock/fake-stock-entity";
import { GetStockByIdUseCase } from "src/domain/usecases/stock/get-stock-by-id-usecase";
import { StockEntity } from "src/domain/abstract/entities/stock-entity";

export class GetStockByIdUseCaseStub extends GetStockByIdUseCase {
  public override async execute(id: string): Promise<StockEntity | Error> {
    return makeFakeStockEntity();
  }
}
