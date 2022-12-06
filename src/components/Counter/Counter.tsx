import {
  View,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import Button from '../Button/Button';
import icons from '../../assets/icons';

interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: (text: string, id?: any) => void;
  id: string | number;
  onIncrease?: (id: string | number) => void;
  onDecrease?: (id: string | number) => void;
}
export default function Counter({
  currentQuantity,
  onChangeText,
  onBlur,
  onDecrease,
  onIncrease,
  id,
}: Props): JSX.Element {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles().container}>
      <Button
        onPress={() => {
          if (onDecrease) {
            onDecrease(id);
          }
        }}
        iconFont={
          <Image
            source={icons.iconMinus}
            style={{
              width: 26,
              height: 26,
            }}
          />
        }
        secondary
        style={{
          width: 40,
          height: 40,
        }}
      />
      <TextInput
        value={currentQuantity.toString()}
        keyboardType="number-pad"
        style={{
          fontFamily: 'NotoSansThai-Bold',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          textAlignVertical: 'center',
          height: 40,
          marginTop: 2,
        }}
        onChangeText={text => onChangeText?.(text, id)}
        onBlur={onBlur}
      />
      <Button
        onPress={() => onIncrease?.(id)}
        iconFont={
          <Image
            source={icons.iconAdd}
            style={{
              width: 26,
              height: 26,
            }}
          />
        }
        secondary
        style={{
          width: 40,
          height: 40,
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = () => {
  return StyleSheet.create({
    container: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  });
};
