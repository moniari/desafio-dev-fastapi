import { makeLoginValidatorFactory } from "../../validators/login-validator-factory";
import { LoginPage } from "src/presentation/pages/login/login-page/login-page";
import { LoginUseCase } from "src/domain/usecases/login/login-usecase";
import { StorageAdapter } from "src/infra/adapters/storage-adapter";
import { LoginApiGateway } from "src/gateways/login-api-gateway";
import { AxiosAdapter } from "src/infra/adapters/axios-adapter";
import { Env } from "src/main/config/env-variables";
import React from "react";

export const MakeLoginPageFactory: React.FC = () => {
  const apiUrl = Env.API_URL;
  const validator = makeLoginValidatorFactory();
  const clientPostRequestSender = new AxiosAdapter();
  const LoginApiInterface = new LoginApiGateway(
    apiUrl + "/login",
    clientPostRequestSender
  );
  const tokenStorage = new StorageAdapter();
  const loginService = new LoginUseCase(LoginApiInterface, tokenStorage);
  return <LoginPage validator={validator} loginUseCase={loginService} />;
};
