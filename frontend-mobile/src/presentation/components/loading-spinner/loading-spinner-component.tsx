import React from "react";
import { View, ActivityIndicator } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.LightColor,
    top: 0,
    left: 0,
    right: 0, 
    bottom: 0,
    zIndex: 9999,
  },
};

type Props = {
  loading: boolean;
};

export const LoadingSpinner: React.FC<Props> = ({ loading }: Props) => {
  return (
    <View style={styles.container as any}>
      {loading && (
        <ActivityIndicator
          size={100}
          style={styles.container as any}
          color={GlobalStyles.colors.MediumLightColor}
        />
      )}
    </View>
  );
};
