import { ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import Spinner, {
  SpinnerPropTypes,
} from 'react-native-loading-spinner-overlay';
import { colors } from '../../assets/colors/colors';

interface Props extends SpinnerPropTypes {
  visible?: boolean;
  textContent?: string;
  textStyle?: ViewStyle;
  setLoading?: (value: boolean) => void;
}
const LoadingSpinner = ({ visible = false, textStyle, setLoading }: Props) => {
  useEffect(() => {
    if (setLoading) {
      setTimeout(() => {
        setLoading && setLoading(false);
      }, 8000);
    }
  }, [visible, setLoading]);
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
