import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";

export class ValidatorStub implements ValidatorInterface {
  public validate(data: any): Error | undefined {
    return;
  }
}
