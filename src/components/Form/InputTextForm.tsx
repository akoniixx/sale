import { View, TextInputProps } from 'react-native';
import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import InputText from '../InputText/InputText';
import { colors } from '../../assets/colors/colors';

interface Props extends TextInputProps {
  label?: string;
  name: string;
  extra?: JSX.Element;
  placeholder?: string;
  value?: string;
}
export default function InputTextForm({ name, ...props }: Props): JSX.Element {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  useEffect(() => {
    if (props.defaultValue) {
      setValue(name, props.defaultValue);
    }
  }, [name]);

  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <InputText
                {...props}
                style={{
                  color: colors.text1,
                  ...props,
                }}
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
