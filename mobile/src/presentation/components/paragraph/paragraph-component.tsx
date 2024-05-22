import React from "react";
import { Text } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  color: GlobalStyles.colors.DarkColor,
  fontSize: 17,
  marginBottom: 8,
  // fontWeight: 'bold',
};

type ParagraphProps = {
  name: string;
  message: string;
};

export const ParagraphComponent: React.FC<ParagraphProps> = ({
  name,
  message,
}) => {
  return <Text style={styles}>{message}</Text>;
};

export default ParagraphComponent;
