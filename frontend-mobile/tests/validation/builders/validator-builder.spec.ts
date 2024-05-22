import { RequiredFieldValidator } from "src/validation/validators/required-field-validator";
import { ValidatorBuilder } from "src/validation/builders/validator-builder";
import { EmailValidator } from "src/validation/validators/email-validator";
import { FakeData } from "tests/utils/data/fake-data";

type SutTypes = {
  sut: ValidatorBuilder;
};

const makeSut = (): SutTypes => {
  const sut = new ValidatorBuilder();
  return { sut };
};

describe("ValidatorBuilder", () => {
  test("Of method should set the field name and return the class instance", () => {
    const { sut } = makeSut();
    const field = FakeData.word();
    const data = sut.of(field);

    expect(data).toBeInstanceOf(ValidatorBuilder);
    expect((data as any).fieldName).toBe(field);
  });

  test("IsRequired method should return a RequiredFieldValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of(FakeData.word()).isRequired();

    expect(validator).toBeInstanceOf(RequiredFieldValidator);
  });

  test("IsEmail method should return a EmailValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of(FakeData.word()).isEmail();

    expect(validator).toBeInstanceOf(EmailValidator);
  });
});
