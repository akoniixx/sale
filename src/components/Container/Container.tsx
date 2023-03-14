import { ViewStyle } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props extends React.ComponentProps<typeof SafeAreaView> {
  children: React.ReactNode;
  containerStyles?: ViewStyle;
}
export default function Container({
  children,
  containerStyles,
  ...props
}: Props) {
  return (
    <SafeAreaView {...props} style={containerStyles}>
      {children}
    </SafeAreaView>
  );
}
Container.defaultProps = {
  containerStyles: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
};
