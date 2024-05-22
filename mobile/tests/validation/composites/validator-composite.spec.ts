import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { ValidatorComposite } from "src/validation/composites/validator-composite";
import { FakeData } from "tests/utils/data/fake-data";

class ValidatorStub implements ValidatorInterface {
  public validate(data: any): Error | undefined {
    return;
  }
}

type SutTypes = {
  sut: ValidatorComposite;
  validatorStub1: ValidatorInterface;
  validatorStub2: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub1 = new ValidatorStub();
  const validatorStub2 = new ValidatorStub();
  const validatorStubs = [validatorStub1, validatorStub2];
  const sut = new ValidatorComposite(validatorStubs);
  return { validatorStub1, validatorStub2, sut };
};

const mockData = () => ({
  email_field: FakeData.email(),
  valid_field: FakeData.email(),
});

describe("ValidatorComposite", () => {
  it("Validate should call validators with correct values", () => {
    const { sut, validatorStub1, validatorStub2 } = makeSut();
    const validatorStubSpy1 = jest.spyOn(validatorStub1, "validate");
    const validatorStubSpy2 = jest.spyOn(validatorStub2, "validate");
    const data = {
      email_field: FakeData.email(),
      valid_field: FakeData.email(),
    };
    sut.validate(data);

    expect(validatorStubSpy1).toHaveBeenCalledTimes(1);
    expect(validatorStubSpy1).toHaveBeenCalledWith(data);
    expect(validatorStubSpy2).toHaveBeenCalledTimes(1);
    expect(validatorStubSpy2).toHaveBeenCalledWith(data);
  });

  it("Validate should return an error if a validator returns an error", () => {
    const { sut, validatorStub1 } = makeSut();
    const errorMessage = FakeData.phrase();
    jest
      .spyOn(validatorStub1, "validate")
      .mockReturnValueOnce(new Error(errorMessage));
    const error = sut.validate(mockData());

    expect(error).toEqual(new Error(errorMessage));
  });

  it("Validate should return undefined", () => {
    const { sut } = makeSut();
    const output = sut.validate(mockData());

    expect(output).toBeUndefined();
  });

  it("SetValidators should set the validators property", () => {
    const { sut, validatorStub1, validatorStub2 } = makeSut();

    expect((sut as any).validators).toEqual([validatorStub1, validatorStub2]);
  });

  it("Should throw if a validator throws", () => {
    const { sut, validatorStub1 } = makeSut();
    jest.spyOn(validatorStub1, "validate").mockImplementationOnce(() => {
      throw new Error(FakeData.phrase());
    });

    expect(() => sut.validate(mockData())).toThrow();
  });
});
