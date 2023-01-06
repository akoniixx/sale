import {
  StyleSheet,
  TextInput,
  Image,
  Platform,
  View,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import Button from '../Button/Button';
import icons from '../../assets/icons';
import { debounce } from 'lodash';

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
  const [quantity, setQuantity] = React.useState(0);

  useEffect(() => {
    if (currentQuantity > 0) {
      setQuantity(currentQuantity);
    }
  }, [currentQuantity]);
  const debouncedSearch = useRef(
    debounce(quantity => {
      onChangeText?.(quantity, id);
    }, 500),
  ).current;
  const inputRef = useRef<TextInput>(null);
  return (
    <View style={styles().container}>
      <Button
        onPress={() => {
          if (onDecrease) {
            onDecrease(id);
            setQuantity(prev => (prev < 1 ? 0 : prev - 5));
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
      <Pressable
        onPress={() => {
          inputRef.current?.focus();
        }}>
        <TextInput
          ref={inputRef}
          value={quantity.toString()}
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
          onChangeText={text => {
            const convertedText = text.replace(/[^0-9]/g, '');
            debouncedSearch(convertedText);
            setQuantity(+convertedText);
          }}
          onBlur={onBlur}
        />
      </Pressable>
      <Button
        onPress={() => {
          onIncrease?.(id);
          setQuantity(prev => prev + 5);
        }}
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
    </View>
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
