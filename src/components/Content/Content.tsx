import { ViewStyle, ImageBackground, ImageBackgroundProps } from 'react-native';
import React from 'react';

interface Props extends ImageBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export default function Content({
  children,
  style,
  ...props
}: Props): JSX.Element {
  return (
    <ImageBackground style={style} {...props}>
      {children}
    </ImageBackground>
  );
}
Content.defaultProps = {
  style: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
};
