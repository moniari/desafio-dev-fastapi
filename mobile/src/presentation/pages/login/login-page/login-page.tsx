import { ErrorMessageComponent } from "src/presentation/components/error-message/error-message-component";
import { LoadingSpinner } from "src/presentation/components/loading-spinner/loading-spinner-component";
import { FormTitleComponent } from "src/presentation/components/form-title/form-title-component";
import { ValidatorInterface } from "src/presentation/abstract/validators/validator-interface";
import { InputComponent } from "src/presentation/components/input/input-component";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { LoginDto } from "src/domain/abstract/dtos/login/login-dto";
import { GlobalStyles } from "src/presentation/styles/global-styles";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
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
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [lockSubmit, setLockSubmit] = useState(false);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [loginData, setLoginData] = useState<LoginDto>({
    email: "user@stock.com",
    password: "stock_is_up_100%",
  });

  const onFormSubmit = async () => {
    setLoading(true);
    try {
      const error = await loginUseCase.execute(loginData);
      if (error instanceof Error) {
        handleFormError(error.message);
      } else {
        navigate("Stock" as never);
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

  const onEmailInputChange = (value: string) => {
    setLoginData((old) => ({ ...old, email: value }));
    setFormError((old) => ({ ...old, show: true }));
    validate()
  };

  const onPasswordInputChange = (value: string) => {
    setLoginData((old) => ({ ...old, password: value }));
    setFormError((old) => ({ ...old, show: true }));
    validate()
  };

  const validate = () => {
    console.log(loginData)
    const error = validator.validate(loginData);
    console.log(error);
    if (error) {
      handleFormError(error.message);
      setLockSubmit(true);
    } else {
      setFormError((old) => ({ ...old, show: false, message: "" }));
      setLockSubmit(false);
    }
  }

  useEffect(() => {
    validate()
  }, [loginData]);

  const styles = {
    loginPage: {
      flex: 1,
      backgroundColor: GlobalStyles.colors.MediumLightColor,
    },
    formContainer: {
      backgroundColor: GlobalStyles.colors.LightColor,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      padding: 20
    },
  };

  return (
    <View style={styles.loginPage}>
      <View style={styles.formContainer}>
        <FormTitleComponent title="Login" />

        <InputComponent
          label="Email"
          type="email"
          name="email"
          value={loginData?.email?.toString() || ""}
          onChange={onEmailInputChange}
          disabled={false}
        />

        <InputComponent
          label="Password"
          type="password"
          name="password"
          value={loginData?.password?.toString() || ""}
          onChange={onPasswordInputChange}
          disabled={false}
        />
        {formError.show && (
          <ErrorMessageComponent message={formError.message} />
        )}
        <ButtonComponent
          disabled={lockSubmit}
          name="Submit"
          type={ButtonTypeEnum.SUBMIT}
          onClickCallback={onFormSubmit}
        />
      </View>
      <LoadingSpinner loading={loading} />
    </View>
  );
};
