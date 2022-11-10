import { ViewStyle, ImageBackground, ImageBackgroundProps } from 'react-native';
import React from 'react';

interface Props extends ImageBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}
export default function Content({
  children,
  style,
  noPadding,
  ...props
}: Props): JSX.Element {
  return (
    <ImageBackground
      style={{
        flex: 1,
        padding: noPadding ? 0 : 16,
        width: '100%',
        ...style,
      }}
      {...props}>
      {children}
    </ImageBackground>
  );
}
