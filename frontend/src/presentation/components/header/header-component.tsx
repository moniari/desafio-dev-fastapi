import React from "react";
import "./styles.scss";

export const HeaderComponent: React.FC = () => {
  return (
    <div className="header" data-testid="header">
      <h2>Stock Price Tracker</h2>
    </div>
  );
};
