import { View } from 'react-native';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import InputText from '../InputText/InputText';

interface Props {
  label?: string;
  name: string;
  extra?: JSX.Element;
}
export default function InputTextForm({ name }: Props): JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <InputText
                isError={!!errors?.[name]}
                onChangeText={value => onChange(value)}
                value={value}
              />
            </>
          );
        }}
      />
    </View>
  );
}
