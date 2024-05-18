
import { GetOneStockPage } from "src/presentation/pages/stock/get-one-stock-page/get-one-stock-page";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { StorageAdapter } from "src/infra/adapters/storage-adapter";
import { AxiosAdapter } from "src/infra/adapters/axios-adapter";
import { Env } from "src/main/config/env-variables";
import React from "react";
        
export const makeGetOneStockPageFactory: React.FC = () => {
  const apiUrl = Env.API_URL;
  const clientRequestSender = new AxiosAdapter();
  const tokenStorage = new StorageAdapter();
  const GetStockByNameUseCase = new GetStockByNameUseCase(
    apiUrl + "/stock",
    clientRequestSender,
    tokenStorage
  );
  return <GetOneStockPage GetStockByNameUseCase={GetStockByNameUseCase} />;
};
