import { AxiosAdapter } from "src/infra/adapters/axios-adapter";
import { FakeData } from "tests/utils/data/fake-data";
import axios from "axios";

const apiResponse = {
  statusCode: 200,
  data: FakeData.object(),
};

jest.mock("axios", () => ({
  post: jest
    .fn()
    .mockImplementationOnce(async () => Promise.resolve(apiResponse)),
  get: jest
    .fn()
    .mockImplementationOnce(async () => Promise.resolve(apiResponse))
}));

type SutTypes = {
  sut: AxiosAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosAdapter();
  return { sut };
};

describe("AxiosAdapter", () => {
  describe("post", () => {
    test("Should call axios post with correct values", async () => {
      const { sut } = makeSut();
      const urlLink = FakeData.url();
      const bodyData = FakeData.object();
      const authToken = FakeData.id();
      await sut.post(urlLink, bodyData, authToken);
      const axiosCalls = jest.spyOn(axios, "post").mock.calls;

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axiosCalls[0][0]).toBe(urlLink);
      expect(axiosCalls[0][1]).toBe(bodyData);
      expect(axiosCalls[0][2]).toEqual({
        validateStatus: expect.any(Function),
        headers: {
          authorization: `Basic ${authToken}`,
        },
      });
    });

    test("Should return the correct data from axios post", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(axios, "post")
        .mockReturnValueOnce(Promise.resolve(apiResponse));
      const data = await sut.post(
        FakeData.url(),
        FakeData.object(),
        FakeData.id()
      );

      expect(data).toEqual(apiResponse.data);
    });

    test("Should throw if axios post throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(axios, "post").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        async () =>
          await sut.post(FakeData.url(), FakeData.object(), FakeData.id())
      ).rejects.toThrow();
    });
  });

  describe("get", () => {
    test("Should call axios get with correct values", async () => {
      const { sut } = makeSut();
      const authToken = FakeData.id();
      const urlLink = FakeData.url();
      await sut.get(urlLink, authToken);
      const axiosCalls = jest.spyOn(axios, "get").mock.calls;

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axiosCalls[0][0]).toBe(urlLink);
      expect(axiosCalls[0][1]?.headers?.authorization).toBe(
        `Basic ${authToken}`
      );
    });

    test("Should return the correct data from axios post", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(axios, "get")
        .mockReturnValueOnce(Promise.resolve(apiResponse));
      const data = await sut.get(FakeData.url(), FakeData.id());

      expect(data).toEqual(apiResponse.data);
    });

    test("Should throw if axios get throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(axios, "get").mockImplementationOnce(() => {
        throw new Error();
      });

      expect(
        async () => await sut.get(FakeData.url(), FakeData.id())
      ).rejects.toThrow();
    });
  });
});
