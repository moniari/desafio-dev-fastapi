
import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { ValidatorComposite } from "src/validation/composites/validator-composite";
import { ValidatorBuilder } from "src/validation/builders/validator-builder";
        
export function makeLoginValidatorFactory(): ValidatorInterface {
  return new ValidatorComposite([new ValidatorBuilder().of("email").isRequired(),new ValidatorBuilder().of("password").isRequired(),]);
}
