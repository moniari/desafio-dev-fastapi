
import { GetOneStockPage } from "src/presentation/pages/stock/get-one-stock-page/get-one-stock-page";
import { ClientGetRequestSenderStub } from "tests/utils/stubs/http/client-get-request-sender-stub";
import { GetStockByIdUseCaseStub } from "tests/utils/stubs/usecases/stock/login-usecase-stub";
import { GetStockByIdUseCase } from "src/domain/usecases/stock/get-stock-by-id-usecase";
import { makeFakeStockEntity } from "tests/utils/data/entities/stock/fake-stock-entity";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { DomTestHelpers } from "tests/utils/dom/dom-test-helpers";
import { render, waitFor } from "@testing-library/react";
import { FakeData } from "tests/utils/data/fake-data";
import React from "react";
        
type SutMockTypes = {
  getStockByIdUseCase?: GetStockByIdUseCase;
};
        
const makeGetStockByIdUseCaseStub = (): GetStockByIdUseCase => {
  return new GetStockByIdUseCaseStub(
    FakeData.url(),
    new ClientGetRequestSenderStub(),
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
                getStockByIdUseCase={
                  mocks?.getStockByIdUseCase ?? makeGetStockByIdUseCaseStub()
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
  test("Should call GetStockByIdUseCase with correct id", async () => {
    const stockData = makeFakeStockEntity();
    const getStockByIdServiceMock = makeGetStockByIdUseCaseStub();
    const getStockByIdServiceSpy = jest.spyOn(getStockByIdServiceMock, "execute");
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockResolvedValueOnce(Promise.resolve(makeFakeStockEntity()));
    makeSut({ getStockByIdUseCase: getStockByIdServiceMock }, stockData.symbol);
    await waitFor(() => {
      expect(getStockByIdServiceSpy).toHaveBeenCalledTimes(1);
      expect(getStockByIdServiceSpy).toHaveBeenCalledWith(stockData.symbol);
    });
  });
        
  test("Should show loading spinner when GetStockByIdUseCase is called", async () => {
    const stockData = makeFakeStockEntity();
    const getStockByIdServiceMock = makeGetStockByIdUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockImplementationOnce(async () => {
        return new Promise(async (resolve) => {
          setTimeout(() => {
            resolve(makeFakeStockEntity()), 500;
          });
        });
      });
    makeSut({ getStockByIdUseCase: getStockByIdServiceMock }, stockData.symbol);
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });
        
  test("Should remove loading spinner after GetStockByIdUseCase returns", async () => {
    await waitFor(() => {
      makeSut();
    });
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeFalsy();
  });
        
  test("Should set the correct stock data", async () => {
    const stockData = makeFakeStockEntity();
    const getStockByIdServiceMock = makeGetStockByIdUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockResolvedValueOnce(Promise.resolve(stockData));
    makeSut({ getStockByIdUseCase: getStockByIdServiceMock }, stockData.symbol);
        
    await waitFor(() => {
      const screenErrorMessage = DomTestHelpers.getElementById("error-message");
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      const formTitle = DomTestHelpers.getElementById("form-title-stock");
      const symbolInput = DomTestHelpers.getInputElementById("symbol-input");
      expect(formTitle?.innerHTML).toBe("Stock");
      expect(screenErrorMessage).toBeNull();
      expect(loadingSpinner).toBeNull();
      expect(symbolInput?.value?.toString()).toBe(stockData?.symbol?.toString());
    });
  });
        
  test("Should show the error message if GetStockByIdUseCase returns an error", async () => {
    const errorMessage = FakeData.phrase();
    const getStockByIdServiceMock = makeGetStockByIdUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockImplementationOnce(async () => {
        return new Error(errorMessage);
      });
    await waitFor(() => {
      makeSut({ getStockByIdUseCase: getStockByIdServiceMock });
    });
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    expect(screenErrorMessage?.innerHTML).toBe(errorMessage);
  });
        
  test("Should show the error message if GetStockByIdUseCase throws", async () => {
    const errorMessage = FakeData.phrase();
    const getStockByIdServiceMock = makeGetStockByIdUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockImplementationOnce(async () => {
        throw new Error(errorMessage);
      });
    await waitFor(() => {
      makeSut({ getStockByIdUseCase: getStockByIdServiceMock });
    });
    await waitFor(() => {
      const screenErrorMessage = DomTestHelpers.getElementById("error-message");
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(screenErrorMessage?.innerHTML).toBe(errorMessage);
      expect(loadingSpinner).toBeNull();
    });
  });
        
  test("Should lock the input fields", async () => {
    const stockData = makeFakeStockEntity();
    const getStockByIdServiceMock = makeGetStockByIdUseCaseStub();
    jest
      .spyOn(getStockByIdServiceMock, "execute")
      .mockResolvedValueOnce(Promise.resolve(stockData));
    makeSut({ getStockByIdUseCase: getStockByIdServiceMock }, stockData.symbol);
    await waitFor(() => {
      const symbolInput = DomTestHelpers.getInputElementById("symbol-input");
      expect(symbolInput.disabled).toBeTruthy();
    });
  });
});
