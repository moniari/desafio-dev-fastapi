import React from "react";
import { Text } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  color: GlobalStyles.colors.Warn,
  fontSize: 17,
  marginTop: -10,
  marginBottom: 10,
  // fontWeight: 'bold',
  // textAlign: 'center',
};

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessageComponent: React.FC<ErrorMessageProps> = ({
  message,
}) => {
  return (
    <Text style={styles}>
      {message.charAt(0).toUpperCase() + message.slice(1)}
    </Text>
  );
};
