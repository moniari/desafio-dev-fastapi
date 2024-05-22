import { EmailValidationInterface } from "src/validation/abstract/validation/email-validation-interface";
import { validate } from "email-validator";

export class EmailValidatorAdapter implements EmailValidationInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
