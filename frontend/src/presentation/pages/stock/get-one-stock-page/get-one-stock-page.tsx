import { ErrorMessageComponent } from "src/presentation/components/error-message/error-message-component";
import { LoadingSpinner } from "src/presentation/components/loading-spinner/loading-spinner-component";
import { FormTitleComponent } from "src/presentation/components/form-title/form-title-component";
import { GetStockByIdUseCase } from "src/domain/usecases/stock/get-stock-by-id-usecase";
import { InputComponent } from "src/presentation/components/input/input-component";
import { StockEntity } from "src/domain/abstract/entities/stock-entity";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.scss";

type Props = {
  getStockByIdUseCase: GetStockByIdUseCase;
};

export const GetOneStockPage: React.FC<Props> = ({
  getStockByIdUseCase,
}: Props) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    message: "",
    show: false,
  });
  const [stockData, setStockData] = useState<StockEntity>({
    symbol: "",
  });

  const handleError = (message: string) => {
    setFormError((old) => ({
      ...old,
      show: true,
      message,
    }));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getStockByIdUseCase
        .execute(id)
        .then((data) => {
          if (data instanceof Error) {
            handleError(data.message);
          } else {
            setStockData(data);
          }
        })
        .catch((error: any) => {
          handleError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="get-one-stock-page">
      <form className="form-container">
        <FormTitleComponent title="Stock" />

        <InputComponent
          label="Symbol"
          type="text"
          name="symbol"
          value={stockData?.symbol?.toString() || ""}
          onChange={() => {}}
          disabled={true}
        />

        {formError.show && (
          <ErrorMessageComponent message={formError.message} />
        )}
      </form>
      <LoadingSpinner loading={loading} />
    </div>
  );
};
