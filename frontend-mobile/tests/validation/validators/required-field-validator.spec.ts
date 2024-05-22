import { RequiredFieldValidator } from "src/validation/validators/required-field-validator";
import { RequiredFieldError } from "src/validation/errors/required-field-error";
import { FakeData } from "tests/utils/data/fake-data";

type SutTypes = {
  sut: RequiredFieldValidator;
};

const makeSut = (fieldName: string): SutTypes => {
  const sut = new RequiredFieldValidator(fieldName);
  return { sut };
};

describe("RequiredFieldValidator", () => {
  test("Should return an error if field does not exist", () => {
    const { sut } = makeSut(FakeData.word());
    const result = sut.validate({
      valid_field1: FakeData.word(),
      valid_field2: FakeData.word(),
    });

    expect(result).toBeInstanceOf(RequiredFieldError);
  });

  test("Should return undefined if field exists", () => {
    const { sut } = makeSut("valid_field");
    const result = sut.validate({
      valid_field: FakeData.word(),
      any_field: FakeData.word(),
    });

    expect(result).toBeUndefined();
  });
});
