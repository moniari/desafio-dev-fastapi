import React from "react";
import { View, Text, TextInput } from "react-native";
import { GlobalStyles } from "src/presentation/styles/global-styles";

const styles = {
  inputField: {
    // display: 'flex',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 17,
    // fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    // width: '100%',
    padding: 8,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.MediumLightColor,
    borderRadius: 4,
    fontSize: 16,
  },
};

type InputFieldProps = {
  label: string;
  type: string;
  name: string;
  value: string;
  disabled: boolean;
  onChange: (text: any) => void;
};

export const InputComponent: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  disabled,
  onChange,
}) => {
  return (
    <View style={styles.inputField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        onChangeText={onChange}
        value={value}
        editable={!disabled}
        style={styles.input}
      />
    </View>
  );
};
