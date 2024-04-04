import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';
import icons from '../../assets/icons';

export default function FakeCheckbox({ value }: { value: boolean }) {
  return value ? (
    <Image
      source={icons.checkbox}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 3,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  ) : (
    <View style={value ? styles.checkedBox : styles.checkbox} />
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: colors.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 4,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
});
