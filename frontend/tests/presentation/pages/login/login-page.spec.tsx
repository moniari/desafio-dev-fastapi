import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { LoginApiGatewayStub } from "tests/utils/stubs/gateways/login-api-gateway-stub";
import { LoginUseCaseStub } from "tests/utils/stubs/usecases/login/login-usecase-stub";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { LoginPage } from "src/presentation/pages/login/login-page/login-page";
import { makeFakeLoginDto } from "tests/utils/data/dtos/login/fake-login-dto";
import { ValidatorStub } from "tests/utils/stubs/validation/validator-stub";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { DomTestHelpers } from "tests/utils/dom/dom-test-helpers";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import { FakeData } from "tests/utils/data/fake-data";
import React from "react";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

type SutMockTypes = {
  validator?: ValidatorInterface;
  loginService?: LoginUseCase;
};

const makeLoginUseCaseStub = (): LoginUseCase => {
  return new LoginUseCaseStub(
    new LoginApiGatewayStub(),
    new TokenStorageStub()
  );
};

const makeSut = (mocks?: SutMockTypes): void => {
  render(
    <>
      {DomTestHelpers.addRouter([
        {
          route: "/",
          element: (
            <LoginPage
              validator={mocks?.validator ?? new ValidatorStub()}
              loginUseCase={mocks?.loginService ?? makeLoginUseCaseStub()}
            />
          ),
        },
      ])}
    </>
  );
};

describe("LoginPage", () => {
  test("Should initiate with empty values", async () => {
    makeSut();
    const formTitle = DomTestHelpers.getElementById("form-title-login");
    const emailInput = DomTestHelpers.getInputElementById("email-input");
    const passwordInput = DomTestHelpers.getInputElementById("password-input");
    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");
    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");

    // expect(emailInput?.value?.toString()).toBe("".toString());
    // expect(passwordInput?.value?.toString()).toBe("".toString());
    expect(formTitle?.innerHTML).toBe("Login");
    // expect(submitButton.disabled).toBeTruthy();
    expect(screenErrorMessage).toBeNull();
    expect(loadingSpinner).toBeNull();
  });

  test("Should show the validator error message", async () => {
    const loginData = makeFakeLoginDto();
    const mockErrorMessage = FakeData.phrase();
    const mockValidator = new ValidatorStub();
    jest
      .spyOn(mockValidator, "validate")
      .mockReturnValueOnce(new Error(mockErrorMessage));
    makeSut({ validator: mockValidator });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );

    await waitFor(() => {
      const screenErrorMessage = DomTestHelpers.getElementById("error-message");
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe(mockErrorMessage);
    });
  });

  test("Should disable button if validator does not return an error", async () => {
    const loginData = makeFakeLoginDto();
    const mockValidator = new ValidatorStub();
    jest.spyOn(mockValidator, "validate").mockReturnValueOnce(undefined);
    makeSut({ validator: mockValidator });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );

    const submitButton = DomTestHelpers.getButtonElementById("submit-button");
    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeNull();
      expect(submitButton.disabled).toBeFalsy();
    });
  });

  test("Should call validator with correct values", async () => {
    const loginData = makeFakeLoginDto();
    const mockValidator = new ValidatorStub();
    const validatorSpy = jest.spyOn(mockValidator, "validate");
    makeSut({ validator: mockValidator });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );
    await DomTestHelpers.changeInputValue(
      "password-input",
      loginData?.password?.toString() || ""
    );

    await waitFor(() => {
      expect(validatorSpy).toHaveBeenCalledTimes(2);
      expect(validatorSpy.mock.calls[1][0].email).toEqual(
        loginData?.email?.toString()
      );
      expect(validatorSpy.mock.calls[1][0].password).toEqual(
        loginData?.password?.toString()
      );
    });
  });

  test("Should call LoginService with correct values", async () => {
    const loginData = makeFakeLoginDto();
    const loginServiceMock = makeLoginUseCaseStub();
    const loginServiceSpy = jest.spyOn(loginServiceMock, "execute");
    jest.spyOn(loginServiceMock, "execute").mockResolvedValueOnce(true);
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );
    await DomTestHelpers.changeInputValue(
      "password-input",
      loginData?.password?.toString() || ""
    );
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      expect(loginServiceSpy).toHaveBeenCalledTimes(1);
      expect(loginServiceSpy.mock.calls[0][0].email).toEqual(
        loginData?.email?.toString()
      );
      expect(loginServiceSpy.mock.calls[0][0].password).toEqual(
        loginData?.password?.toString()
      );
    });
  });

  test("Should show a default message if Validator throws", async () => {
    const loginData = makeFakeLoginDto();
    const validatorMock = new ValidatorStub();
    jest.spyOn(validatorMock, "validate").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ validator: validatorMock });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should show a default message if LoginService throws", async () => {
    const loginData = makeFakeLoginDto();
    const loginServiceMock = makeLoginUseCaseStub();
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(() => {
      throw new Error();
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );
    await DomTestHelpers.changeInputValue(
      "password-input",
      loginData?.password?.toString() || ""
    );
    await DomTestHelpers.clickButton("submit-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe("An error occurred");
    });
  });

  test("Should show the error message if LoginService returns an error", async () => {
    const mockErrorMessage = FakeData.phrase();
    const loginData = makeFakeLoginDto();
    const loginServiceMock = makeLoginUseCaseStub();
    jest
      .spyOn(loginServiceMock, "execute")
      .mockResolvedValueOnce(new Error(mockErrorMessage));
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );
    await DomTestHelpers.changeInputValue(
      "password-input",
      loginData?.password?.toString() || ""
    );
    await DomTestHelpers.clickButton("submit-button");

    const screenErrorMessage = DomTestHelpers.getElementById("error-message");

    await waitFor(() => {
      expect(screenErrorMessage).toBeTruthy();
      expect(screenErrorMessage?.innerHTML).toBe(mockErrorMessage);
    });
  });

  test("Should show loading spinner on button click", async () => {
    const loginData = makeFakeLoginDto();
    const loginServiceMock = makeLoginUseCaseStub();
    jest.spyOn(loginServiceMock, "execute");
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Promise.resolve(true);
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );
    await DomTestHelpers.changeInputValue(
      "password-input",
      loginData?.password?.toString() || ""
    );
    await DomTestHelpers.clickButton("submit-button");

    const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
    expect(loadingSpinner).toBeTruthy();
  });

  test("Should remove the loading spinner after LoginService return", async () => {
    const loginData = makeFakeLoginDto();
    const loginServiceMock = makeLoginUseCaseStub();
    jest.spyOn(loginServiceMock, "execute");
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Promise.resolve(true);
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue(
      "email-input",
      loginData?.email?.toString() || ""
    );
    await DomTestHelpers.changeInputValue(
      "password-input",
      loginData?.password?.toString() || ""
    );
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      const loadingSpinner = DomTestHelpers.getElementById("loading-spinner");
      expect(loadingSpinner).toBeFalsy();
    });
  });

  test("Should redirect to home page if login was done", async () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockImplementation(
      () => navigateMock
    );
    const loginServiceMock = makeLoginUseCaseStub();
    jest.spyOn(loginServiceMock, "execute");
    jest.spyOn(loginServiceMock, "execute").mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Promise.resolve(true);
    });
    makeSut({ loginService: loginServiceMock });

    await DomTestHelpers.changeInputValue("email-input", FakeData.email());
    await DomTestHelpers.changeInputValue(
      "password-input",
      FakeData.password()
    );
    await DomTestHelpers.clickButton("submit-button");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/stock");
    });
  });
});
