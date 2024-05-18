import { ErrorMessageComponent } from "src/presentation/components/error-message/error-message-component";
import { LoadingSpinner } from "src/presentation/components/loading-spinner/loading-spinner-component";
import { FormTitleComponent } from "src/presentation/components/form-title/form-title-component";
import { ParagraphComponent } from "src/presentation/components/paragraph/paragraph-component";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { InputComponent } from "src/presentation/components/input/input-component";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";
import React, { useState } from "react";
import "./styles.scss";
import {
  ButtonComponent,
  ButtonTypeEnum,
} from "src/presentation/components/button/button-component";

type Props = {
  getStockByNameUseCase: GetStockByNameUseCase;
};

export const GetOneStockPage: React.FC<Props> = ({
  getStockByNameUseCase,
}: Props) => {
  const [lockSubmit, setLockSubmit] = useState(true);
  const [searchTerm, setSearchTerm] = useState("aapl.us");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [stockData, setStockData] = useState<StockInfoDto>({
    simbolo: "",
    nome_da_empresa: "",
    cotacao: 0,
  });

  const handleError = (message: string) => {
    setFormError((old) => ({
      ...old,
      show: true,
      message,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value.toString().trim() !== "") {
      setLockSubmit(false);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    getStockByNameUseCase
      .execute(searchTerm)
      .then((data) => {
        if (data instanceof Error) {
          handleError(data.message);
        } else {
          setStockData(data);
          handleError("");
        }
      })
      .catch((error) => {
        handleError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="get-one-stock-page">
      <form className="form-container">
        <FormTitleComponent title="Stock" />

        <InputComponent
          label="Symbol"
          type="text"
          name="symbol"
          value={searchTerm}
          onChange={handleChange}
          disabled={false}
        />

        {formError.show && (
          <ErrorMessageComponent message={formError.message} />
        )}

        <ButtonComponent
          disabled={lockSubmit}
          name="Submit"
          type={ButtonTypeEnum.SUBMIT}
          onClickCallback={handleSubmit}
        />
      </form>

      {loading && <LoadingSpinner loading={loading} />}

      <div className="form-container">
        <ParagraphComponent
          name="symbol"
          message={`Symbol: ${stockData.simbolo}`}
        />
        <ParagraphComponent
          name="companyname"
          message={`Company name: ${stockData.nome_da_empresa}`}
        />
        <ParagraphComponent
          name="price"
          message={`Price: $${stockData.cotacao}`}
        />
      </div>
    </div>
  );
};
