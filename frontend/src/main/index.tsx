import { makeGetOneStockPageFactory } from "./factories/pages/stock/get-one-stock-page-factory";
import { HeaderComponent } from "src/presentation/components/header/header-component";
import { makeLoginPageFactory } from "./factories/pages/login/login-page-factory";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "src/presentation/styles/index.scss";
import ReactDOM from "react-dom";
import React from "react";

const Router = () => {
  return (
    <>
      <HeaderComponent />
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={makeLoginPageFactory} />
          <Route path="/stock" Component={makeGetOneStockPageFactory} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);
