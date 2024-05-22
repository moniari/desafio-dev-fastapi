import { makeLoginValidatorFactory } from "src/main/factories/validators/login-validator-factory";
import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { ValidatorComposite } from "src/validation/composites/validator-composite";
import { ValidatorBuilder } from "src/validation/builders/validator-builder";

type SutTypes = {
  sut: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const sut = makeLoginValidatorFactory();
  return { sut };
};

describe("LoginValidatorFactory", () => {
  test("Should setup validators correctly", () => {
    const { sut } = makeSut();
    expect(sut as any).toEqual(
      new ValidatorComposite([
        new ValidatorBuilder().of("email").isRequired(),
        new ValidatorBuilder().of("password").isRequired(),
      ])
    );
  });
});
