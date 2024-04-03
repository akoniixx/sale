import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import InputActionSheet from './InputActionSheet';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  sheetId?: string;
  listData: {
    id: string;
    title: string;
  }[];
  defaultValue?: {
    id: string;
    title: string;
  };
}
export default function InputSheetForm({
  name,
  listData,
  sheetId = 'input-select-sheet',
  disabled,
  required,
  placeholder,
  label,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  // useEffect(() => {
  //   if (defaultValue) {
  //     setValue(name, defaultValue);
  //   }
  // }, [name]);
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        disabled={disabled}
        render={({ field: { onChange, value } }) => {
          return (
            <InputActionSheet
              listData={listData}
              sheetId={sheetId}
              label={label}
              disabled={disabled}
              required={required}
              onChange={v => {
                onChange(v);
              }}
              value={value}
              placeholder={placeholder}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
