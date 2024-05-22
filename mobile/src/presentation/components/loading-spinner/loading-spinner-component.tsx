import React from "react";
import { View, ActivityIndicator } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  // display: 'flex',
  // justifyContent: 'center',
  // alignItems: 'center',
  // height: '100%',
  // width: '100%',
  // position: 'absolute', // Fixed positioning might be trickier
  top: 0,
  left: 0,
  backgroundColor: GlobalStyles.colors.LightColor, // Adjust opacity
  zIndex: 9999,
};

type Props = {
  loading: boolean;
};

export const LoadingSpinner: React.FC<Props> = ({ loading }: Props) => {
  return (
    <View style={styles}>
      {loading && (
        <ActivityIndicator
          size="large"
          color={GlobalStyles.colors.MediumLightColor}
        />
      )}
    </View>
  );
};
