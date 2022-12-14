import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';
interface Props {
  listCheckbox: {
    title: string;
    value: string;
    key: string;
    amount?: number;
  }[];
  valueCheckbox?: string[];
  onPress?: (value: string) => void;
}
export default function CheckboxListView({
  listCheckbox = [],
  valueCheckbox,
  onPress,
}: Props) {
  return (
    <>
      {listCheckbox.map((item, idx) => {
        const isLast = idx === listCheckbox.length - 1;
        return (
          <View key={idx} style={styles({ isLast }).containerCheckbox}>
            <Text
              style={{
                width: Dimensions.get('window').width - 72,
              }}>
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => onPress && onPress(item.value)}
              style={
                styles({
                  isChecked: valueCheckbox?.includes(item.value),
                }).checkBox
              }>
              {valueCheckbox?.includes(item.value) && (
                <Image
                  source={icons.iconCheck}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </>
  );
}
const styles = ({
  isChecked = false,
  isLast = false,
}: {
  isChecked?: boolean;
  isLast?: boolean;
}) => {
  return StyleSheet.create({
    checkBox: {
      borderColor: isChecked ? colors.primary : colors.border1,
      backgroundColor: isChecked ? colors.primary : colors.border1,
      borderWidth: 5,
      width: 20,
      height: 20,
      borderRadius: 4,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerCheckbox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 40,
      padding: 16,
      borderBottomColor: colors.border1,
      borderBottomWidth: isLast ? 0 : 1,
    },
  });
};
