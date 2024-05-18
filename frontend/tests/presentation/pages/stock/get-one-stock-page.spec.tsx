import { GetOneStockPage } from "src/presentation/pages/stock/get-one-stock-page/get-one-stock-page";
import { StockPriceApiGatewayStub } from "tests/utils/stubs/gateways/stock-price-api-gateway-stub";
import { GetStockByNameUseCaseStub } from "tests/utils/stubs/usecases/stock/login-usecase-stub";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { makeFakeStockInfoDto } from "tests/utils/data/dtos/stock/fake-stock-info-dto.ts";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { DomTestHelpers } from "tests/utils/dom/dom-test-helpers";
import { render, waitFor } from "@testing-library/react";
import { FakeData } from "tests/utils/data/fake-data";

type SutMockTypes = {
  getStockByNameUseCase?: GetStockByNameUseCase;
};

const makeGetStockByNameUseCaseStub = (): GetStockByNameUseCase => {
  return new GetStockByNameUseCaseStub(
    new StockPriceApiGatewayStub(),
    new TokenStorageStub()
  );
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <>
      {DomTestHelpers.addRouter(
        [
          {
            route: "/stock",
            element: (
              <GetOneStockPage
                getStockByNameUseCase={
                  mocks?.getStockByNameUseCase ??
                  makeGetStockByNameUseCaseStub()
                }
              />
            ),
          },
        ],
        "/stock"
      )}
    </>
  );
};

describe("GetOneStockPage", () => {
  test("Should initiate with empty values", async () => {
    makeSut();
    const formTitle = DomTestHelpers.getElementById("form-title-stock");
    const symbolInput = DomTestHelpers.getInputElementById("symbol-input");
    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    const symbol = DomTestHelpers.getElementById("symbol-paragraph");
    const companyName = DomTestHelpers.getElementById("companyname-paragraph");
    const price = DomTestHelpers.getElementById("price-paragraph");

    // expect(symbolInput?.value?.toString()).toBe("".toString());
    expect(formTitle?.innerHTML).toBe("Stock");
    // expect(submitButton.disabled).toBeTruthy();
    expect(screenErrorMessage).toBeNull();
    expect(loadingSpinner).toBeNull();
    expect(symbol?.innerHTML).toBe("Symbol: ");
    expect(companyName?.innerHTML).toBe("Company name: ");
    expect(price?.innerHTML).toBe("Price: $0");
  });

  test("Should enable submit button when symbol is filled", async () => {
    makeSut();
    await DomTestHelpers.changeInputValue("symbol-input", FakeData.word());
    await waitFor(() => {
      const submitButton = DomTestHelpers.getButtonElementById("submit-button");
      expect(submitButton.disabled).toBeFalsy();
    });
  });

  test("Should call GetStockByNameUseCase when submit button is clicked", async () => {
    const stockData = makeFakeStockInfoDto();
    const getStockServiceStub = makeGetStockByNameUseCaseStub();
    const stockServiceSpy = jest.spyOn(getStockServiceStub, "execute");
    jest.spyOn(getStockServiceStub, "execute").mockResolvedValueOnce(stockData);
    makeSut({ getStockByNameUseCase: getStockServiceStub });

    await DomTestHelpers.changeInputValue("symbol-input", stockData.simbolo);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      expect(stockServiceSpy).toHaveBeenCalledTimes(1);
      expect(stockServiceSpy.mock.calls[0][0]).toEqual(
        stockData?.simbolo?.toString()
      );
    });
  });

  test("Should set stock info when GetStockByNameUseCase returns the data", async () => {
    const stockData = makeFakeStockInfoDto();
    const getStockServiceStub = makeGetStockByNameUseCaseStub();
    jest.spyOn(getStockServiceStub, "execute").mockResolvedValueOnce(stockData);
    makeSut({ getStockByNameUseCase: getStockServiceStub });

    await DomTestHelpers.changeInputValue("symbol-input", stockData.simbolo);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      const symbol = DomTestHelpers.getElementById("symbol-paragraph");
      const companyName = DomTestHelpers.getElementById(
        "companyname-paragraph"
      );
      const price = DomTestHelpers.getElementById("price-paragraph");

      expect(symbol?.innerHTML).toBe(`Symbol: ${stockData.simbolo}`);
      expect(companyName?.innerHTML).toBe(
        `Company name: ${stockData.nome_da_empresa}`
      );
      expect(price?.innerHTML).toBe(`Price: $${stockData.cotacao}`);
    });
  });

  test("Should display loading spinner when GetStockByNameUseCase is called", async () => {
    const stockData = makeFakeStockInfoDto();
    const getOneStockUseCase = makeGetStockByNameUseCaseStub();
    jest.spyOn(getOneStockUseCase, "execute");
    jest
      .spyOn(getOneStockUseCase, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(stockData);
      });
    makeSut({ getStockByNameUseCase: getOneStockUseCase });

    await DomTestHelpers.changeInputValue("symbol-input", stockData.simbolo);
    await DomTestHelpers.clickButton("submit-button");

    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  test("Should remove loading spinner when request is done", async () => {
    const stockData = makeFakeStockInfoDto();
    const getOneStockUseCase = makeGetStockByNameUseCaseStub();
    jest.spyOn(getOneStockUseCase, "execute");
    jest
      .spyOn(getOneStockUseCase, "execute")
      .mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return Promise.resolve(stockData);
      });
    makeSut({ getStockByNameUseCase: getOneStockUseCase });

    await DomTestHelpers.changeInputValue("symbol-input", stockData.simbolo);
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(loadingSpinner).toBeFalsy();
    });
  });

  test("Should display error message when GetStockByNameUseCase throws", async () => {
    const getStockServiceStub = makeGetStockByNameUseCaseStub();
    const errorMessage = FakeData.phrase();
    jest
      .spyOn(getStockServiceStub, "execute")
      .mockRejectedValueOnce(new Error(errorMessage));
    makeSut({ getStockByNameUseCase: getStockServiceStub });

    await DomTestHelpers.changeInputValue("symbol-input", FakeData.word());
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      const screenErrorMessage = DomTestHelpers.getElementById("error-message");
      expect(screenErrorMessage?.innerHTML).toBe(errorMessage);
    });
  });
});
