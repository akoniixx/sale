import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';

interface Props {
  radioLists: {
    title: string;
    value: string;
    key: string;
  }[];
  onChange?: (value: string) => void;
  value?: string;
  label?: string;
}
export default function Radio({
  radioLists,
  value,
  onChange,
}: Props): JSX.Element {
  return (
    <View>
      {radioLists.map((item, idx) => {
        const isLast = idx === radioLists.length - 1;

        return (
          <View key={item.key} style={styles({ isLast }).container}>
            <TouchableOpacity
              onPress={() => onChange?.(item.value)}
              style={
                styles({
                  selected: value === item.value,
                }).radio
              }
            />
            <Text>{item.title}</Text>
          </View>
        );
      })}
    </View>
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
      backgroundColor: selected ? colors.white : colors.border1,
      borderWidth: 5,
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
