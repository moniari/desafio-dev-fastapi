import { ClientPostRequestSenderInterface } from "src/domain/abstract/adapters/client-post-request-sender-interface";
import { LoginApiGateway } from "src/gateways/login-api-gateway";
import { FakeData } from "tests/utils/data/fake-data";
import { ClientPostRequestSenderStub } from "tests/utils/stubs/http/client-post-request-sender-stub";

type SutTypes = {
  clientPostRequestSender: ClientPostRequestSenderInterface;
  sut: LoginApiGateway;
};

const makeSut = (apiUrl = FakeData.url()): SutTypes => {
  const clientPostRequestSender = new ClientPostRequestSenderStub();
  const sut = new LoginApiGateway(apiUrl, clientPostRequestSender);
  return { sut, clientPostRequestSender };
};

describe("LoginApiGateway", () => {
  test("Should call ClientPostRequestSender with correct values", async () => {
    const url = FakeData.url();
    const { sut, clientPostRequestSender } = makeSut(url);
    const loginData = {
      email: FakeData.email(),
      password: FakeData.word(),
    };
    const clientPostSpy = jest.spyOn(clientPostRequestSender, "post");
    await sut.login(loginData);

    expect(clientPostSpy).toHaveBeenCalledWith(url, loginData);
    expect(clientPostSpy).toHaveBeenCalledTimes(1);
  });

  test("Should return the token returned by ClientPostRequestSender", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    const token = FakeData.word();
    jest.spyOn(clientPostRequestSender, "post").mockResolvedValueOnce({
      token: token,
    });
    const response = await sut.login({
      email: FakeData.email(),
      password: FakeData.word(),
    });

    expect(response).toBe(token);
  });

  test("Should return null if ClientPostRequestSender do not return a token", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    jest.spyOn(clientPostRequestSender, "post").mockResolvedValueOnce({});
    const response = await sut.login({
      email: FakeData.email(),
      password: FakeData.word(),
    });

    expect(response).toBeNull();
  });

  test("Should return null if ClientPostRequestSender return null", async () => {
    const { sut, clientPostRequestSender } = makeSut();
    jest.spyOn(clientPostRequestSender, "post").mockResolvedValueOnce(null);
    const response = await sut.login({
      email: FakeData.email(),
      password: FakeData.word(),
    });

    expect(response).toBeNull();
  });

//   test("Should throw if if ClientPostRequestSender return null", async () => {
//     const { sut, clientPostRequestSender } = makeSut();
//     jest.spyOn(clientPostRequestSender, "post").mockResolvedValueOnce(null);
//     const response = await sut.login({
//       email: FakeData.email(),
//       password: FakeData.word(),
//     });

//     expect(response).toBeNull();
//   });
});
