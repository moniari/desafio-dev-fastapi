import { makeFakeStockInfoDto } from "tests/utils/data/dtos/stock/fake-stock-info-dto.ts";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";

export class GetStockByNameUseCaseStub extends GetStockByNameUseCase {
  public override async execute(id: string): Promise<StockInfoDto | Error> {
    return makeFakeStockInfoDto();
  }
}
