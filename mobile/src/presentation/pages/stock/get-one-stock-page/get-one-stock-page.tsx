import { ErrorMessageComponent } from "src/presentation/components/error-message/error-message-component";
import { LoadingSpinner } from "src/presentation/components/loading-spinner/loading-spinner-component";
import { FormTitleComponent } from "src/presentation/components/form-title/form-title-component";
import { ParagraphComponent } from "src/presentation/components/paragraph/paragraph-component";
import { GetStockByNameUseCase } from "src/domain/usecases/stock/get-stock-by-name-usecase";
import { InputComponent } from "src/presentation/components/input/input-component";
import { StockInfoDto } from "src/domain/abstract/dtos/stock/stock-info-dto";
import { GlobalStyles } from "src/presentation/styles/global-styles";
import React, { useState } from "react";
import { View } from "react-native";
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
  const [lockSubmit, setLockSubmit] = useState(false);
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

  const handleChange = (value: string) => {
    setSearchTerm(value);
    if (value.toString().trim() !== "") {
      setLockSubmit(false);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    getStockByNameUseCase
      .execute(searchTerm)
      .then((data: StockInfoDto | Error) => {
        if (data instanceof Error) {
          handleError(data.message);
        } else {
          setStockData(data);
          setFormError((old) => ({ ...old, show: false }));
        }
      })
      .catch((error) => {
        handleError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const styles = {
    getOneStockPage: {
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
      padding: 20,
      margin: 2,
    },
  };

  return (
    <View style={styles.getOneStockPage}>
      <View style={styles.formContainer}>
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
          name="Button"
          type={ButtonTypeEnum.SUBMIT}
          onClickCallback={handleSubmit}
        />
      </View>

      {loading ? (
        <LoadingSpinner loading={loading} />
      ) : (
        <View style={styles.formContainer}>
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
        </View>
      )}
    </View>
  );
};
