import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';
import { SheetManager } from 'react-native-actions-sheet';
import icons from '../../assets/icons';

interface Props {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  sheetId: string;
  listData: {
    id: string;
    title: string;
  }[];
  onChange?: (value: any) => void;
  value?: any;
}
export default function InputActionSheet({
  label,
  required,
  disabled,
  placeholder,
  sheetId,
  listData,
  onChange,
  value,
}: Props) {
  const onPressInput = async () => {
    const result:
      | {
          id: string;
          title: string;
        }
      | undefined = await SheetManager.show(sheetId, {
      payload: {
        headerText: label,
        listData: listData,
        value: value,
      },
    });

    if (result && result?.id) {
      if (result?.id?.toString() === value?.id?.toString()) {
        return;
      }
      onChange && onChange(result);
    } else {
      onChange &&
        onChange({
          id: '',
          title: '',
        });
    }
  };
  return (
    <View style={styles.container}>
      {label && (
        <Text semiBold fontFamily="NotoSans">
          {label}
          <Text color="error" semiBold>
            {required && ' *'}
          </Text>
        </Text>
      )}
      <TouchableOpacity
        onPress={onPressInput}
        style={disabled ? styles.disableInput : styles.fakeInput}
        disabled={disabled}>
        {value?.title ? (
          <Text color="text2">{value.title}</Text>
        ) : (
          <Text color={'text3'}>{placeholder}</Text>
        )}
        <Image
          source={icons.iconDropdown}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fakeInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
  },
  disableInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: colors.background1,
    height: 48,
    paddingHorizontal: 16,
  },
});
