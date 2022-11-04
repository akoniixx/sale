import { TextInput, TextInputProps, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface InputStyledProps {
  isError?: boolean;
}
interface Props extends TextInputProps, InputStyledProps {
  style?: ViewStyle;
}
const InputText = ({ style, ...props }: Props) => {
  return (
    <TextInput
      {...props}
      style={[
        styles({
          ...props,
        }).input,
        style,
      ]}
    />
  );
};

export default InputText;
const styles = ({ isError = false }: InputStyledProps) => {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: isError ? colors.error : colors.border1,
      borderRadius: 6,
      paddingLeft: 16,
    },
  });
};
