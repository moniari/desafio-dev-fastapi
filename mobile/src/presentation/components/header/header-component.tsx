import React from "react";
import { View, Text } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  header: {
    backgroundColor: GlobalStyles.colors.MediumColor,
    padding: 20,
    textAlign: "center",
    // position: 'absolute',
    // width: '100%',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  headerTitle: {
    color: GlobalStyles.colors.LightColor,
    fontSize: 24,
    margin: 0,
  },
};

export const HeaderComponent: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Stock Price Tracker</Text>
    </View>
  );
};
