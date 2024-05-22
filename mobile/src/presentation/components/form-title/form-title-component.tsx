import React from "react";
import { Text, View } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  container: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: GlobalStyles.colors.DarkColor,
    fontWeight: "bold",
  },
};

type FormTitleProps = {
  title: string;
};

export const FormTitleComponent: React.FC<FormTitleProps> = ({ title }) => {
  return (
    <View style={styles.container as any}>
      <Text style={styles.title as any}>{title}</Text>
    </View>
  );
};

