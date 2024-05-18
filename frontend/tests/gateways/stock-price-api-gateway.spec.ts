import { ClientGetRequestSenderInterface } from "src/domain/abstract/adapters/client-get-request-sender-interface";
import { ClientGetRequestSenderStub } from "tests/utils/stubs/http/client-get-request-sender-stub";
import { StockPriceApiGateway } from "src/gateways/stock-price-api-gateway";
import { FakeData } from "tests/utils/data/fake-data";
import { makeFakeStockInfoDto } from "tests/utils/data/dtos/stock/fake-stock-info-dto";

type SutTypes = {
  clientGetRequestSender: ClientGetRequestSenderInterface;
  sut: StockPriceApiGateway;
};

const makeSut = (url = FakeData.url()): SutTypes => {
  const clientGetRequestSender = new ClientGetRequestSenderStub();
  const sut = new StockPriceApiGateway(url, clientGetRequestSender);
  return { sut, clientGetRequestSender };
};

describe("StockPriceApiGateway", () => {
  test("Should call ClientGetRequestSender with correct values", async () => {
    const url = FakeData.url();
    const symbol = FakeData.word();
    const { sut, clientGetRequestSender } = makeSut(url);
    const clientGetSpy = jest.spyOn(clientGetRequestSender, "get");
    await sut.execute(symbol);

    expect(clientGetSpy).toHaveBeenCalledWith(`${url}?c=${symbol}`);
  });

  test("Should return the stock info from ClientGetRequestSender", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    const stockInfo = makeFakeStockInfoDto();
    jest.spyOn(clientGetRequestSender, "get").mockResolvedValueOnce(stockInfo);
    const output = await sut.execute(FakeData.word());

    expect(output).toEqual(stockInfo);
  });

  test("Should return null if ClientGetRequestSender returns null", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    jest.spyOn(clientGetRequestSender, "get").mockResolvedValueOnce(null);
    const output = await sut.execute(FakeData.word());

    expect(output).toEqual(null);
  });

  test("Should return null if ClientGetRequestSender do not have the stock info", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    jest.spyOn(clientGetRequestSender, "get").mockResolvedValueOnce({});
    const output = await sut.execute(FakeData.word());

    expect(output).toEqual(null);
  });

  test("Should throw if ClientGetRequestSender throws", async () => {
    const { sut, clientGetRequestSender } = makeSut();
    jest.spyOn(clientGetRequestSender, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(FakeData.word())).rejects.toThrow();
  });
});