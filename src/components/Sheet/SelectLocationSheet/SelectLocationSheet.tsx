import { View, StyleSheet } from 'react-native';
import React from 'react';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import Text from '../../Text/Text';

export default function SelectLocationSheet(props: SheetProps) {
  return (
    <ActionSheet id={props.sheetId}>
      <View style={styles.container}>
        <Text>SelectLocationSheet</Text>
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '30%',
  },
});
