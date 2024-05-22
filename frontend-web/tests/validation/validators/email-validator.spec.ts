import { EmailValidationInterface } from "src/validation/abstract/validation/email-validation-interface";
import { InvalidFieldError } from "src/validation/errors/invalid-field-error";
import { EmailValidator } from "src/validation/validators/email-validator";
import { FakeData } from "tests/utils/data/fake-data";

class EmailValidationStub implements EmailValidationInterface {
  public isEmail(value: string): boolean {
    return true;
  }
}

type SutTypes = {
  sut: EmailValidator;
  emailValidation: EmailValidationInterface;
};

const makeSut = (fieldName: string): SutTypes => {
  const emailValidation = new EmailValidationStub();
  const sut = new EmailValidator(fieldName);
  (sut as any).emailValidation = emailValidation;
  return { sut, emailValidation };
};

describe("EmailValidator", () => {
  test("Should call EmailValidation with correct values", () => {
    const { sut, emailValidation } = makeSut("email_field");
    const validationSpy = jest.spyOn(emailValidation, "isEmail");
    const mockData = { email_field: FakeData.email() };
    sut.validate(mockData);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(mockData.email_field);
  });

  test("Should return undefined if field does not exist", () => {
    const { sut } = makeSut("invalid_field");
    const result = sut.validate({ email_field: FakeData.email() });

    expect(result).toBeUndefined();
  });

  test("Should return an error if EmailValidation returns false", () => {
    const { sut, emailValidation } = makeSut("email_field");
    jest.spyOn(emailValidation, "isEmail").mockReturnValueOnce(false);
    const result = sut.validate({ email_field: FakeData.email() });

    expect(result).toBeInstanceOf(InvalidFieldError);
  });

  test("Should throw if EmailValidation throws", () => {
    const { sut, emailValidation } = makeSut("email_field");
    jest.spyOn(emailValidation, "isEmail").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.validate({ email_field: FakeData.email() })).toThrow();
  });

  test("Should return undefined on success", () => {
    const { sut } = makeSut("email_field");
    const result = sut.validate({ email_field: FakeData.email() });

    expect(result).toBeUndefined();
  });
});
