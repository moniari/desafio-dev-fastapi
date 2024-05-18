import { ErrorMessageComponent } from "src/presentation/components/error-message/error-message-component";
import { LoadingSpinner } from "src/presentation/components/loading-spinner/loading-spinner-component";
import { FormTitleComponent } from "src/presentation/components/form-title/form-title-component";
import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { InputComponent } from "src/presentation/components/input/input-component";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import {
  ButtonComponent,
  ButtonTypeEnum,
} from "src/presentation/components/button/button-component";

type Props = {
  validator: ValidatorInterface;
  loginUseCase: LoginUseCase;
};

export const LoginPage: React.FC<Props> = ({
  validator,
  loginUseCase,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [lockSubmit, setLockSubmit] = useState(true);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [loginData, setLoginData] = useState<LoginDto>({
    email: "",
    password: "",
  });

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const error = await loginUseCase.execute(loginData);
      if (error instanceof Error) {
        handleFormError(error.message);
      }
    } catch (error) {
      handleFormError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFormError = (message: string) => {
    setFormError((old) => ({
      ...old,
      show: true,
      message,
    }));
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((old) => ({ ...old, [name]: value }));
    setFormError((old) => ({ ...old, show: true }));
  };

  useEffect(() => {
    if (formError.show) {
      try {
        const error = validator.validate(loginData);
        if (error) {
          handleFormError(error.message);
          setLockSubmit(true);
        } else {
          setFormError((old) => ({ ...old, show: false, message: "" }));
          setLockSubmit(false);
        }
      } catch (error) {
        handleFormError("An error occurred");
      }
    }
  }, [loginData]);

  return (
    <div className="login-page">
      <form onSubmit={onFormSubmit} className="form-container">
        <FormTitleComponent title="Login" />

        <InputComponent
          label="Email"
          type="email"
          name="email"
          value={loginData?.email?.toString() || ""}
          onChange={onInputChange}
          disabled={false}
        />

        <InputComponent
          label="Password"
          type="password"
          name="password"
          value={loginData?.password?.toString() || ""}
          onChange={onInputChange}
          disabled={false}
        />

        {formError.show && (
          <ErrorMessageComponent message={formError.message} />
        )}
        <ButtonComponent
          disabled={lockSubmit}
          name="Submit"
          type={ButtonTypeEnum.SUBMIT}
        />
      </form>
      <LoadingSpinner loading={loading} />
    </div>
  );
};
