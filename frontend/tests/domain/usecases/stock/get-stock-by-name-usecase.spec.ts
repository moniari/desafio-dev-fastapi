import { ClientGetRequestSenderStub } from "tests/utils/stubs/http/client-get-request-sender-stub";
import { StockPriceApiInterface } from "src/domain/abstract/gateways/stock-price-api-interface";
import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { makeFakeStockInfoDto } from "tests/utils/data/dtos/stock/fake-stock-info-dto";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { StockPriceApiGateway } from "src/gateways/stock-price-api-gateway";
import { DefaultError } from "src/domain/errors/default-error";
import { FakeData } from "tests/utils/data/fake-data";
import { ApiError } from "src/domain/errors/api-error";

type SutTypes = {
  sut: GetStockByNameUseCase;
  stockPriceApi: StockPriceApiInterface;
  tokenStorage: TokenStorageInterface;
};

const makeSut = (): SutTypes => {
  const stockPriceApi = new StockPriceApiGateway(
    FakeData.url(),
    new ClientGetRequestSenderStub()
  );
  const tokenStorage = new TokenStorageStub();
  const sut = new GetStockByNameUseCase(stockPriceApi, tokenStorage);

  return { sut, stockPriceApi, tokenStorage };
};

describe("GetStockByNameUseCase", () => {
  test("Should call TokenStorage with correct values", async () => {
    const { sut, tokenStorage } = makeSut();
    const storageSpy = jest.spyOn(tokenStorage, "get");
    await sut.execute(FakeData.id());

    expect(storageSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledWith("token");
  });

  test("Should throw if TokenStorage throws", async () => {
    const { sut, tokenStorage } = makeSut();
    jest.spyOn(tokenStorage, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(FakeData.id())).rejects.toThrow();
  });

  test("Should call StockPriceApi with correct values", async () => {
    const stockSymbol = FakeData.word();
    const authToken = FakeData.password();
    const { sut, stockPriceApi, tokenStorage } = makeSut();
    const requestSenderSpy = jest.spyOn(stockPriceApi, "execute");
    jest
      .spyOn(tokenStorage, "get")
      .mockReturnValueOnce(Promise.resolve(authToken));
    await sut.execute(stockSymbol);

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(stockSymbol, authToken);
  });

  test("Should return the StockPriceApi output data", async () => {
    const { sut, stockPriceApi } = makeSut();
    const stockEntity = makeFakeStockInfoDto();
    jest
      .spyOn(stockPriceApi, "execute")
      .mockReturnValueOnce(Promise.resolve(stockEntity));
    const data = await sut.execute(FakeData.word());

    expect(data).toEqual(stockEntity);
  });

  test("Should throw if StockPriceApi throws", async () => {
    const { sut, stockPriceApi } = makeSut();
    jest.spyOn(stockPriceApi, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(FakeData.word())).rejects.toThrow();
  });

  test("Should return an error if StockPriceApi returns an error", async () => {
    const { sut, stockPriceApi } = makeSut();
    const errorMessage = FakeData.phrase();
    jest
      .spyOn(stockPriceApi, "execute")
      .mockResolvedValueOnce(new ApiError(errorMessage));
    const error = await sut.execute(FakeData.word());

    expect(error).toEqual(new ApiError(errorMessage));
  });

  test("Should return an error if StockPriceApi returns null", async () => {
    const { sut, stockPriceApi } = makeSut();
    jest
      .spyOn(stockPriceApi, "execute")
      .mockReturnValueOnce(Promise.resolve(null));
    const error = await sut.execute(FakeData.word());

    expect(error).toBeInstanceOf(DefaultError);
  });
});
