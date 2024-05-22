import { LoadingSpinner } from "../components/loading-spinner/loading-spinner-component";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  PrivatePage: React.FC<any>;
  loginPageRoute: string;
};

export const PrivatePageProxy: React.FC<Props> = ({
  PrivatePage,
  loginPageRoute,
}) => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticaion] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthenticaion(true);
      } else {
        navigate(loginPageRoute);
      }
    } catch (error) {
      navigate(loginPageRoute);
    }
  }, []);

  return (
    <>{authenticated ? <PrivatePage /> : <LoadingSpinner loading={true} />}</>
  );
};
