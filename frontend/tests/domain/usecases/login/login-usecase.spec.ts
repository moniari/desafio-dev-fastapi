import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { ClientPostRequestSenderStub } from "tests/utils/stubs/http/client-post-request-sender-stub";
import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";
import { makeFakeLoginEntity } from "tests/utils/data/entities/login/fake-login-entity";
import { TokenStorageStub } from "tests/utils/stubs/adapters/token-storage-stub";
import { makeFakeLoginDto } from "tests/utils/data/dtos/login/fake-login-dto";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { DefaultError } from "src/domain/errors/default-error";
import { ApiError } from "src/domain/errors/api-error";
import { FakeData } from "tests/utils/data/fake-data";

type SutTypes = {
  sut: LoginUseCase;
  clientPostRequestSender: ClientPostRequestSenderInterface;
  tokenStorage: TokenStorageInterface;
};

const makeSut = (loginCreationUrl = FakeData.url()): SutTypes => {
  const clientPostRequestSender = new ClientPostRequestSenderStub();
  const tokenStorage = new TokenStorageStub();
  const sut = new LoginUseCase(
    loginCreationUrl,
    clientPostRequestSender,
    tokenStorage
  );
  return { sut, clientPostRequestSender, tokenStorage };
};

describe("LoginUseCase", () => {
  test("Should call TokenStorage with correct values", async () => {
    const { sut, tokenStorage } = makeSut();
    const storageSpy = jest.spyOn(tokenStorage, "get");
    await sut.execute(makeFakeLoginDto());

    expect(storageSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledWith("token");
  });

  test("Should throw if TokenStorage throws", async () => {
    const { sut, tokenStorage } = makeSut();
    jest.spyOn(tokenStorage, "get").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeFakeLoginDto())).rejects.toThrow();
  });

  test("Should call ClientPostRequestSender with correct values", async () => {
    const apiUrl = FakeData.url();
    const loginDto = makeFakeLoginDto();
    const loginToken = FakeData.id();
    const { sut, clientPostRequestSender, tokenStorage } = makeSut(apiUrl);
    jest.spyOn(tokenStorage, "get").mockResolvedValueOnce(loginToken);
    const requestSenderSpy = jest.spyOn(clientPostRequestSender, "post");
    await sut.execute(loginDto);

    expect(requestSenderSpy).toHaveBeenCalledTimes(1);
    expect(requestSenderSpy).toHaveBeenCalledWith(apiUrl, loginDto, loginToken);
  });

  test("Should return the ClientPostRequestSender output data", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    const loginEntity = makeFakeLoginEntity();
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve(loginEntity));
    const data = await sut.execute(makeFakeLoginDto());

    expect(data).toEqual(loginEntity);
  });

  test("Should throw if ClientPostRequestSender throws", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    jest.spyOn(clientPostRequestSender, "post").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeFakeLoginDto())).rejects.toThrow();
  });

  test("Should return an error if ClientPostRequestSender returns undefined", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve(undefined));
    const error = await sut.execute(makeFakeLoginDto());

    expect(error).toBeInstanceOf(DefaultError);
  });

  test("Should return an error if ClientPostRequestSender returns an object with error property", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    jest
      .spyOn(clientPostRequestSender, "post")
      .mockReturnValueOnce(Promise.resolve({ error: FakeData.phrase() }));
    const error = await sut.execute(makeFakeLoginDto());

    expect(error).toBeInstanceOf(ApiError);
  });
});
