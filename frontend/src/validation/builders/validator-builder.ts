import { ValidatorInterface } from "../../presentation/abstract/validators/validator-interface";
import { EmailValidator } from "../validators/email-validator";
import { RequiredFieldValidator } from "../validators/required-field-validator";

export class ValidatorBuilder {
  private fieldName: string;

  public constructor() {
    this.fieldName = "";
  }

  public of(fieldName: string): typeof this {
    this.fieldName = fieldName;
    return this;
  }

  public isRequired(): ValidatorInterface {
    return new RequiredFieldValidator(this.fieldName);
  }

  public isEmail(): ValidatorInterface {
    return new EmailValidator(this.fieldName);
  }
}
