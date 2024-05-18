
import { ClientGetRequestSenderInterface } from "src/domain/abstract/adapters/client-get-request-sender-interface";
import { ClientGetRequestSenderStub } from "tests/utils/stubs/http/client-get-request-sender-stub";
import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { makeFakeStockEntity } from "tests/utils/data/entities/stock/fake-stock-entity";
import { GetStockByIdUseCase } from "src/domain/usecases/stock/get-stock-by-id-usecase";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { DefaultError } from "src/domain/errors/default-error";
import { ApiError } from "src/domain/errors/api-error";
import { FakeData } from "tests/utils/data/fake-data";
        
const authToken = FakeData.password();
        
type SutTypes = {
  sut: GetStockByIdUseCase;
  clientGetRequestSender: ClientGetRequestSenderInterface;
  tokenStorage: TokenStorageInterface;
};
        
const makeSut = (stockSearchUrl = FakeData.url()): SutTypes => {
  const clientGetRequestSender = new ClientGetRequestSenderStub();
  const tokenStorage = new TokenStorageStub();
  const sut = new GetStockByIdUseCase(
    stockSearchUrl,
    clientGetRequestSender,
    tokenStorage
  );
        
  return { sut, clientGetRequestSender, tokenStorage };
};
        
describe("GetStockByIdUseCase", () => {
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
        
  test("Should call ClientGetRequestSender with correct values", async () => {
    const apiUrl = FakeData.url();
    const stockId = FakeData.id();
    const { sut, clientGetRequestSender, tokenStorage } = makeSut(apiUrl);
    const requestSenderSpy = jest.spyOn(clientGetRequestSender, "get");
    jest
      .spyOn(tokenStorage, "get")
      .mockReturnValueOnce(Promise.resolve(authToken));
    await sut.execute(stockId);
        
    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(
      `${apiUrl}/${stockId}`,
      authToken
    );
  });
        
  test("Should return the ClientGetRequestSender output data", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    const stockEntity = makeFakeStockEntity();
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve(stockEntity));
    const data = await sut.execute(FakeData.id());
        
    expect(data).toEqual(stockEntity);
  });
        
  test("Should throw if ClientGetRequestSender throws", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    jest.spyOn(clientGetRequestSender, "get").mockImplementationOnce(() => {
      throw new Error();
    });
        
    expect(async () => await sut.execute(FakeData.id())).rejects.toThrow();
  });
        
  test("Should return an error if ClientGetRequestSender returns undefined", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute(FakeData.id());
        
    expect(error).toBeInstanceOf(DefaultError);
  });
        
  test("Should return an error if ClientGetRequestSender returns an object with error property", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    jest
      .spyOn(clientGetRequestSender, "get")
      .mockReturnValueOnce(Promise.resolve({ error: FakeData.phrase() }));
    const error = await sut.execute(FakeData.id());
        
    expect(error).toBeInstanceOf(ApiError);
  });
});
