import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface InputStyledProps {
  isError?: boolean;
}
interface Props extends TextInputProps, InputStyledProps {}
const InputText = ({ style, ...props }: Props) => {
  return (
    <TextInput
      placeholderTextColor={colors.text3}
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
