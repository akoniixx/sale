import { ViewStyle } from 'react-native';
import React from 'react';
import Spinner, {
  SpinnerPropTypes,
} from 'react-native-loading-spinner-overlay';
import { colors } from '../../assets/colors/colors';

interface Props extends SpinnerPropTypes {
  visible?: boolean;
  textContent?: string;
  textStyle?: ViewStyle;
}
const LoadingSpinner = ({ visible = false, textStyle }: Props) => {
  return (
    <Spinner
      animation="fade"
      visible={visible}
      textContent={'Loading'}
      textStyle={{
        color: colors.white,
        fontFamily: 'Sarabun-Medium',
        ...textStyle,
      }}
    />
  );
};

export default LoadingSpinner;
