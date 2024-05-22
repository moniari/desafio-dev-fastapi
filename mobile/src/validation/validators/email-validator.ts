import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { EmailValidationInterface } from "../abstract/validation/email-validation-interface";
import { EmailValidatorAdapter } from "src/infra/adapters/email-validator-adapter";
import { InvalidFieldError } from "../errors/invalid-field-error";

export class EmailValidator implements ValidatorInterface {
  private readonly emailValidation: EmailValidationInterface;
  private readonly fieldName: string;

  public constructor(fieldName: string) {
    this.emailValidation = new EmailValidatorAdapter();
    this.fieldName = fieldName;
  }

  public validate(data: any): Error | undefined {
    if (!data[this.fieldName]) {
      return undefined;
    }
    if (!this.emailValidation.isEmail(data[this.fieldName])) {
      return new InvalidFieldError(this.fieldName);
    }
  }
}
