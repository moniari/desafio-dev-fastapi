import React from "react";
import "./styles.scss";

export const HeaderComponent: React.FC = () => {
  return (
    <div className="header" data-testid="header">
      <h2>Header</h2>
    </div>
  );
};
