import { Text as TextRN, TextProps, StyleSheet, TextStyle } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface TextStyled {
  bold?: boolean;
  light?: boolean;
  semiBold?: boolean;
  medium?: boolean;
  fontSize?:
    | 10
    | 12
    | 14
    | 16
    | 18
    | 20
    | 22
    | 24
    | 26
    | 28
    | 30
    | 32
    | 34
    | 36
    | 38
    | 40;
  lineHeight?: number;
  fontFamily?: 'Sarabun' | 'NotoSans';
  color?:
    | 'primary'
    | 'secondary'
    | 'white'
    | 'text1'
    | 'text2'
    | 'text3'
    | 'current'
    | 'error'
    | 'specialRequest'
    | 'waiting'
    | 'border2';
  left?: boolean;
  right?: boolean;
  center?: boolean;
}
interface Props extends TextProps, TextStyled {
  children: React.ReactNode;
  style?: TextStyle;
}
export default function Text({ children, style, ...props }: Props) {
  return (
    <TextRN style={[styled(props).text, style]} {...props}>
      {children}
    </TextRN>
  );
}
const styled = ({
  bold,
  light,
  semiBold,
  medium,
  fontSize = 16,
  color = 'text1',
  left,
  right,
  center,
  fontFamily = 'Sarabun',
  lineHeight,
}: TextStyled) => {
  const fontSarabun = bold
    ? 'Sarabun-Bold'
    : light
    ? 'Sarabun-Light'
    : semiBold
    ? 'Sarabun-SemiBold'
    : medium
    ? 'Sarabun-Medium'
    : 'Sarabun-Regular';
  const fontNotoSans = bold
    ? 'NotoSansThai-Bold'
    : light
    ? 'NotoSansThai-Light'
    : semiBold
    ? 'NotoSansThai-SemiBold'
    : 'NotoSansThai-Regular';
  const textAlign = left
    ? 'left'
    : right
    ? 'right'
    : center
    ? 'center'
    : 'left';

  return StyleSheet.create({
    text: {
      fontSize: fontSize,
      fontFamily: fontFamily === 'Sarabun' ? fontSarabun : fontNotoSans,
      color: colors[color],
      textAlign,
      lineHeight,
    },
  });
};
