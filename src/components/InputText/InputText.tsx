import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';

interface InputStyledProps {
  isError?: boolean;
  ref?: any;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}
interface Props extends TextInputProps, InputStyledProps {}
const InputText = React.forwardRef(
  ({ style, label, required, ...props }: Props, ref) => {
    return (
      <>
        {label && (
          <Text semiBold fontFamily="NotoSans">
            {label}
            <Text color="error" semiBold>
              {required && ' *'}
            </Text>
          </Text>
        )}
        <TextInput
          ref={ref}
          editable={!props.disabled}
          placeholderTextColor={colors.text3}
          {...props}
          style={[
            styles({
              ...props,
            })[props.disabled ? 'disableInput' : 'input'],
            style,
          ]}
        />
      </>
    );
  },
);

InputText.displayName = 'InputText';
export default InputText;
const styles = ({ isError = false }: InputStyledProps) => {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: isError ? colors.error : colors.border1,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: 'Sarabun-Regular',
      color: colors.text1,

      minHeight: 48,
    },
    disableInput: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border1,
      backgroundColor: colors.background1,
      paddingHorizontal: 16,
      fontFamily: 'Sarabun-Regular',

      color: colors.text1,
      fontSize: 16,
      minHeight: 48,
    },
  });
};
