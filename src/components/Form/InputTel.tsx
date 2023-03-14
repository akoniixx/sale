import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import Text from '../Text/Text';
interface Props {
  name: string;
  errorManual?: string;
}
const InputTel = ({ name, errorManual }: Props): JSX.Element => {
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor:
                    errors[name] || errorManual ? colors.error : colors.border1,
                  borderRadius: 6,
                  padding: Platform.OS === 'ios' ? 12 : 0,
                  paddingHorizontal: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      borderRightWidth: 1,
                      borderColor: colors.border1,
                      width: 48,
                    }}>
                    <Image
                      source={icons.flagTH}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      paddingLeft: 16,
                    }}
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="081xxxxxxx"
                    maxLength={10}
                    autoFocus
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.text3}
                  />
                </View>
                {value.length > 0 && (
                  <TouchableOpacity onPress={() => onChange(undefined)}>
                    <Image
                      source={icons.close}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </>
          );
        }}
      />
      {(errors[name] || errorManual) && (
        <View
          style={{
            marginTop: 8,
            alignItems: 'center',
          }}>
          <Text color="error">{`${
            errorManual ? errorManual : errors[name]?.message
          }`}</Text>
        </View>
      )}
    </View>
  );
};

export default InputTel;
