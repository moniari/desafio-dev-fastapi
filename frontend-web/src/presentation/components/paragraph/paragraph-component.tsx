import React from "react";
import "./styles.scss";

type InputFieldProps = {
  name: string;
  message: string;
};

export const ParagraphComponent: React.FC<InputFieldProps> = ({
  name,
  message,
}: InputFieldProps) => {
  return (
    <div className="paragraph">
      <p data-testid={`${name.toLowerCase().replace(/\s/g, "")}-paragraph`}>
        {message}
      </p>
    </div>
  );
};
