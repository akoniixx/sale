import { View, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';

interface Props {
  isSelected: boolean;
}
export default function RadioFake({ isSelected }: Props) {
  return (
    <View
      style={
        styles({
          selected: isSelected,
        }).radio
      }
    />
  );
}
const styles = ({
  selected = false,
  isLast = false,
}: {
  selected?: boolean;
  isLast?: boolean;
}) => {
  return StyleSheet.create({
    radio: {
      borderColor: selected ? colors.primary : colors.border1,
      backgroundColor: selected ? colors.white : colors.white,
      borderWidth: selected ? 5 : 1,
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 12,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isLast ? 0 : 12,
    },
  });
};
