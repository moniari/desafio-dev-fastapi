import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  button: {
    backgroundColor: GlobalStyles.colors.DarkColor,
    border: "none",
    borderRadius: 4,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    transition: "background-color 0.3s",
  },
  disabled: {
    backgroundColor: GlobalStyles.colors.MediumLightColor,
  },
  enabled: {
    backgroundColor: GlobalStyles.colors.MediumDarkColor,
  },
  hover: {
    backgroundColor: GlobalStyles.colors.DarkColor,
  },
  text: {
    color: GlobalStyles.colors.LightColor,
    fontSize: 16,
    textAlign: "center",
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
      <Text style={styles.text as any}>{name}</Text>
    </TouchableOpacity>
  );
};
