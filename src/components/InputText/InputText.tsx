import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface InputStyledProps {
  isError?: boolean;
  ref?: any;
}
interface Props extends TextInputProps, InputStyledProps {}
const InputText = React.forwardRef(({ style, ...props }: Props, ref) => {
  return (
    <TextInput
      ref={ref}
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
});

InputText.displayName = 'InputText';
export default InputText;
const styles = ({ isError = false }: InputStyledProps) => {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: isError ? colors.error : colors.border1,
      borderRadius: 6,
      paddingLeft: 16,
      paddingVertical: 16,
      fontSize: 16,
      fontFamily: 'Sarabun-Regular',
      color: colors.text1,
    },
  });
};
