import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  button: {
    color: GlobalStyles.colors.MediumLightColor,
    border: "none",
    borderRadius: 4,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16,
    transition: "background-color 0.3s",
  },
  disabled: {
    color: GlobalStyles.colors.LightColor,
    backgroundColor: GlobalStyles.colors.MediumLightColor,
  },
  enabled: {
    color: GlobalStyles.colors.LightColor,
    backgroundColor: GlobalStyles.colors.MediumDarkColor,
  },
  hover: {
    backgroundColor: GlobalStyles.colors.DarkColor,
  },
};

export enum ButtonTypeEnum {
  BUTTON = "button",
  SUBMIT = "submit",
}

type SubmitButtonProps = {
  name: string;
  type: ButtonTypeEnum;
  disabled: boolean;
  onClickCallback?: () => any;
};

export const ButtonComponent: React.FC<SubmitButtonProps> = ({
  name,
  disabled,
  type,
  onClickCallback,
}) => {
  const handlePress = () => {
    if (onClickCallback) {
      onClickCallback();
    }
  };

  const buttonStyle = {
    ...styles.button,
    ...(disabled ? styles.disabled : styles.enabled),
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={buttonStyle}
    >
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};
