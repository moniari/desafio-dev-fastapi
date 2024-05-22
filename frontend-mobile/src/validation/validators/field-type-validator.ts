import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { InvalidFieldError } from "../errors/invalid-field-error";
import { FieldTypeEnum } from "../abstract/enums/field-type-enum";

export class FieldTypeValidator implements ValidatorInterface {
  private readonly fieldName: string;
  private readonly fieldType: FieldTypeEnum;

  public constructor(fieldName: string, fieldType: FieldTypeEnum) {
    this.fieldName = fieldName;
    this.fieldType = fieldType;
  }

  public validate(data: any): Error | undefined {
    if (this.isFieldAvailable(data)) {
      if (this.fieldType === FieldTypeEnum.ARRAY) {
        return this.handleArrayValidation(data);
      } else if (this.fieldType === FieldTypeEnum.NUMBER) {
        return this.handleANumberValidation(data);
      } else {
        return this.handleFieldTypeValidation(data);
      }
    }
  }

  private isFieldAvailable(data: any): boolean {
    return this.fieldName in data;
  }

  private handleArrayValidation(data: any): Error | undefined {
    if (!Array.isArray(data[this.fieldName])) {
      return new InvalidFieldError(this.fieldName);
    }
    return undefined;
  }

  private handleANumberValidation(data: any): Error | undefined {
    if (
      typeof data[this.fieldName] === FieldTypeEnum.NUMBER ||
      (typeof data[this.fieldName] === FieldTypeEnum.STRING &&
        !isNaN(data[this.fieldName]))
    ) {
      return undefined;
    }
    return new InvalidFieldError(this.fieldName);
  }

  private handleFieldTypeValidation(data: any): Error | undefined {
    if (typeof data[this.fieldName] !== this.fieldType) {
      return new InvalidFieldError(this.fieldName);
    }
    return undefined;
  }
}
