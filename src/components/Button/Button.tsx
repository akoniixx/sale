import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';

interface ButtonStyledProps {
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  success?: boolean;
  radius?: number;
  noBorder?: boolean;
}
interface Props extends TouchableOpacityProps, ButtonStyledProps {
  title?: string;
}
export default function Button({ title, ...props }: Props): JSX.Element {
  return (
    <TouchableOpacity
      {...props}
      style={[styled({ ...props }).button, props.style]}>
      <Text color={props.secondary ? 'primary' : 'white'}>{title}</Text>
    </TouchableOpacity>
  );
}
const styled = ({ secondary, success, danger }: ButtonStyledProps) => {
  const backgroundColor = secondary
    ? colors.secondary
    : success
    ? colors.success
    : danger
    ? colors.error
    : colors.primary;
  return StyleSheet.create({
    button: {
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      width: '100%',
    },
  });
};
