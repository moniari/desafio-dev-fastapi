import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { LoginApiGatewayStub } from "tests/utils/stubs/gateways/login-api-gateway-stub";
import { LoginApiInterface } from "src/domain/abstract/gateways/login-api-interface";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { makeFakeLoginDto } from "tests/utils/data/dtos/login/fake-login-dto";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { DefaultError } from "src/domain/errors/default-error";
import { FakeData } from "tests/utils/data/fake-data";
import { ApiError } from "src/domain/errors/api-error";

type SutTypes = {
  sut: LoginUseCase;
  loginApiGateway: LoginApiInterface;
  tokenStorage: TokenStorageInterface;
};

const makeSut = (): SutTypes => {
  const loginApiGateway = new LoginApiGatewayStub();
  const tokenStorage = new TokenStorageStub();
  const sut = new LoginUseCase(loginApiGateway, tokenStorage);
  return { sut, loginApiGateway, tokenStorage };
};

describe("LoginUseCase", () => {
  test("Should call LoginApi with correct values", async () => {
    const loginDto = makeFakeLoginDto();
    const { sut, loginApiGateway } = makeSut();
    const requestSenderSpy = jest.spyOn(loginApiGateway, "execute");
    await sut.execute(loginDto);

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(loginDto);
  });

  test("Should throw if LoginApi throws", async () => {
    const { sut, loginApiGateway } = makeSut();
    jest.spyOn(loginApiGateway, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeFakeLoginDto())).rejects.toThrow();
  });

  test("Should return an error if LoginApi returns an error", async () => {
    const { sut, loginApiGateway } = makeSut();
    const errorMessage = FakeData.phrase();
    jest.spyOn(loginApiGateway, "execute").mockResolvedValueOnce(new ApiError(errorMessage));
    const error = await sut.execute(makeFakeLoginDto());

    expect(error).toEqual(new ApiError(errorMessage));
  });

  test("Should return an error if LoginApi returns null", async () => {
    const { sut, loginApiGateway } = makeSut();
    jest.spyOn(loginApiGateway, "execute").mockResolvedValueOnce(null);
    const error = await sut.execute(makeFakeLoginDto());

    expect(error).toEqual(new DefaultError());
  });

  test("Should call TokenStorage with correct token", async () => {
    const { sut, loginApiGateway, tokenStorage } = makeSut();
    const token = FakeData.word();
    jest.spyOn(loginApiGateway, "execute").mockResolvedValueOnce(token);
    const storageSpy = jest.spyOn(tokenStorage, "store");
    await sut.execute(makeFakeLoginDto());

    expect(storageSpy).toHaveBeenCalledWith("token", token);
    expect(storageSpy).toHaveBeenCalledTimes(1);
  });

  test("Should throw if TokenStorage throws", async () => {
    const { sut, tokenStorage } = makeSut();
    jest.spyOn(tokenStorage, "store").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeFakeLoginDto())).rejects.toThrow();
  });
});
