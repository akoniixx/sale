import { View } from 'react-native';
import React from 'react';
import ListItemInCart from './ListItemInCart';

import { useLocalization } from '../../contexts/LocalizationContext';

export default function StepOne(): JSX.Element {
  return (
    <View>
      <ListItemInCart />
      {/* <Summary /> */}
      <View
        style={{
          height: 10,
        }}
      />
    </View>
  );
}
// const styles = StyleSheet.create({
//   containerFooter: {
//     backgroundColor: colors.white,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: -4,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 1.62,
//     elevation: 14,
//   },
//   buttonFooter: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     minHeight: 48,
//     borderRadius: 8,
//   },
//   circle: {
//     width: 16,
//     height: 16,
//     position: 'absolute',
//     right: -6,
//     borderColor: colors.primary,
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     zIndex: 1,
//     padding: 2,
//     backgroundColor: colors.white,
//   },
// });
