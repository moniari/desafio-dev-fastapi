import { MinLengthValidator } from "src/validation/validators/min-length-validator";
import { InvalidFieldError } from "src/validation/errors/invalid-field-error";
import { FakeData } from "tests/utils/data/fake-data";

type SutTypes = {
  sut: MinLengthValidator;
};

const makeSut = (fieldName: string, minFieldLength: number = 3): SutTypes => {
  const sut = new MinLengthValidator(fieldName, minFieldLength);
  return { sut };
};

describe("MinLengthValidator", () => {
  test("Should return undefined if field does not exist", () => {
    const { sut } = makeSut("invalid_field");
    const error = sut.validate({});

    expect(error).toBeUndefined();
  });

  test("Should return an error if field is not a string", () => {
    const { sut } = makeSut("number_field");
    const error = sut.validate({ number_field: FakeData.numberInteger() });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  test("Should return an error if field is lesser than the minimum length", () => {
    const { sut } = makeSut("invalid_field", 6);
    const error = sut.validate({ invalid_field: FakeData.word(5) });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  test("Should return undefined if field length is equal to the minimum", () => {
    const { sut } = makeSut("valid_field", 6);
    const result = sut.validate({ valid_field: FakeData.word(6) });

    expect(result).toBeUndefined();
  });

  test("Should return undefined if field length is greater to the minimum", () => {
    const { sut } = makeSut("valid_field", 6);
    const result = sut.validate({ valid_field: FakeData.word(7) });

    expect(result).toBeUndefined();
  });
});
