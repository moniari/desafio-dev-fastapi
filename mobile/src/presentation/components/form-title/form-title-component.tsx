import React from "react";
import { Text } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  fontSize: 24,
  marginBottom: 20,
  color: GlobalStyles.colors.DarkColor,
  // fontWeight: 'bold',
  // textAlign: 'center',
};

type FormTitleProps = {
  title: string;
};

export const FormTitleComponent: React.FC<FormTitleProps> = ({ title }) => {
  return <Text style={styles}>{title}</Text>;
};
