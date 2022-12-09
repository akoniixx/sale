import { ViewStyle, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { Picker } from '@react-native-picker/picker';
import Text from '../Text/Text';
interface Props {
  value?: any;
  placeholder?: string;
  style?: ViewStyle;
  data?: any[];
}
export default function Dropdown({
  value,
  placeholder,
  style,
  data,
  ...props
}: Props) {
  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Open ActionSheet');
        }}>
        <Text>Open ActionSheet</Text>
      </TouchableOpacity>

      <Picker>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </>
  );
}
const styles = StyleSheet.create({
  button: {},
});
