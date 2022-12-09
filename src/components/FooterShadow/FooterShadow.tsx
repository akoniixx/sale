import { View, ViewStyle } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface Props {
  style?: ViewStyle;
  children?: React.ReactNode;
}
export default function FooterShadow({ style, children }: Props): JSX.Element {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        width: '100%',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 1.62,
        elevation: 14,

        ...style,
      }}>
      {children}
    </View>
  );
}
