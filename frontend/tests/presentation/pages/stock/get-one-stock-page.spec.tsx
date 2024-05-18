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
  GetStockByNameUseCase?: GetStockByNameUseCase;
};

const makeGetStockByNameUseCaseStub = (): GetStockByNameUseCase => {
  return new GetStockByNameUseCaseStub(
    new StockPriceApiGatewayStub(),
    new TokenStorageStub()
  );
};

const makeSut = (mocks?: SutMockTypes, id = FakeData.id()): void => {
  render(
    <>
      {DomTestHelpers.addRouter(
        [
          {
            route: "/get-one-stock/:id",
            element: (
              <GetOneStockPage
                GetStockByNameUseCase={
                  mocks?.GetStockByNameUseCase ??
                  makeGetStockByNameUseCaseStub()
                }
              />
            ),
          },
        ],
        `/get-one-stock/${id}`
      )}
    </>
  );
};

describe("GetOneStockPage", () => {
  test("Should call GetStockByNameUseCase with correct id", async () => {
    const stockData = makeFakeStockInfoDto();
    const getStockByIdServiceMock = makeGetStockByNameUseCaseStub();
    const getStockByIdServiceSpy = jest.spyOn(
      getStockByIdServiceMock,
      "execute"
    );
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockResolvedValueOnce(Promise.resolve(makeFakeStockInfoDto()));
    makeSut(
      { GetStockByNameUseCase: getStockByIdServiceMock },
      stockData.simbolo
    );
    await waitFor(() => {
      expect(getStockByIdServiceSpy).toHaveBeenCalledTimes(1);
      expect(getStockByIdServiceSpy).toHaveBeenCalledWith(stockData.simbolo);
    });
  });

  test("Should show loading spinner when GetStockByNameUseCase is called", async () => {
    const stockData = makeFakeStockInfoDto();
    const getStockByIdServiceMock = makeGetStockByNameUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockImplementationOnce(async () => {
        return new Promise(async (resolve) => {
          setTimeout(() => {
            resolve(makeFakeStockInfoDto()), 500;
          });
        });
      });
    makeSut(
      { GetStockByNameUseCase: getStockByIdServiceMock },
      stockData.simbolo
    );
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  test("Should remove loading spinner after GetStockByNameUseCase returns", async () => {
    await waitFor(() => {
      makeSut();
    });
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeFalsy();
  });

  test("Should set the correct stock data", async () => {
    const stockData = makeFakeStockInfoDto();
    const getStockByIdServiceMock = makeGetStockByNameUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockResolvedValueOnce(Promise.resolve(stockData));
    makeSut(
      { GetStockByNameUseCase: getStockByIdServiceMock },
      stockData.simbolo
    );

    await waitFor(() => {
      const screenErrorMessage = DomTestHelpers.getElementById("error-message");
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      const formTitle = DomTestHelpers.getElementById("form-title-stock");
      const symbolInput = DomTestHelpers.getInputElementById("simbolo-input");
      expect(formTitle?.innerHTML).toBe("Stock");
      expect(screenErrorMessage).toBeNull();
      expect(loadingSpinner).toBeNull();
      expect(symbolInput?.value?.toString()).toBe(
        stockData?.simbolo?.toString()
      );
    });
  });

  test("Should show the error message if GetStockByNameUseCase returns an error", async () => {
    const errorMessage = FakeData.phrase();
    const getStockByIdServiceMock = makeGetStockByNameUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockImplementationOnce(async () => {
        return new Error(errorMessage);
      });
    await waitFor(() => {
      makeSut({ GetStockByNameUseCase: getStockByIdServiceMock });
    });
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    expect(screenErrorMessage?.innerHTML).toBe(errorMessage);
  });

  test("Should show the error message if GetStockByNameUseCase throws", async () => {
    const errorMessage = FakeData.phrase();
    const getStockByIdServiceMock = makeGetStockByNameUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockImplementationOnce(async () => {
        throw new Error(errorMessage);
      });
    await waitFor(() => {
      makeSut({ GetStockByNameUseCase: getStockByIdServiceMock });
    });
    await waitFor(() => {
      const screenErrorMessage = DomTestHelpers.getElementById("error-message");
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(screenErrorMessage?.innerHTML).toBe(errorMessage);
      expect(loadingSpinner).toBeNull();
    });
  });

  test("Should lock the input fields", async () => {
    const stockData = makeFakeStockInfoDto();
    const getStockByIdServiceMock = makeGetStockByNameUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockResolvedValueOnce(Promise.resolve(stockData));
    makeSut(
      { GetStockByNameUseCase: getStockByIdServiceMock },
      stockData.simbolo
    );
    await waitFor(() => {
      const symbolInput = DomTestHelpers.getInputElementById("simbolo-input");
      expect(symbolInput.disabled).toBeTruthy();
    });
  });
});
