import { makeLoginValidatorFactory } from "../../validators/login-validator-factory";
import { LoginPage } from "src/presentation/pages/login/login-page/login-page";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { StorageAdapter } from "src/infra/adapters/storage-adapter";
import { AxiosAdapter } from "src/infra/adapters/axios-adapter";
import { Env } from "src/main/config/env-variables";
import React from "react";

export const makeLoginPageFactory: React.FC = () => {
  const apiUrl = Env.API_URL;
  const validator = makeLoginValidatorFactory();
  const clientPostRequestSender = new AxiosAdapter();
  const tokenStorage = new StorageAdapter();
  const loginService = new LoginUseCase(
    apiUrl + "/login",
    clientPostRequestSender,
    tokenStorage
  );
  return (
    <LoginPage
      validator={validator}
      loginUseCase={loginService}
    />
  );
};
