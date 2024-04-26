import { StyleSheet, TextInput, Image, View, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import icons from '../../assets/icons';

import { useLocalization } from '../../contexts/LocalizationContext';
import ModalWarning from '../Modal/ModalWarning';
import { numberReturnString, numberWithCommas } from '../../utils/functions';

interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: ({ id, quantity }: { quantity: string; id?: any }) => void;
  id: string | number;
  onIncrease?: (id: string | number) => void;
  onDecrease?: (id: string | number) => void;
  setCounter?: React.Dispatch<React.SetStateAction<number>>;
}
export default function Counter({
  currentQuantity,
  onChangeText,
  onDecrease,
  onIncrease,
  id,
  setCounter,
}: Props): JSX.Element {
  const [quantity, setQuantity] = useState('0');
  const { t } = useLocalization();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  useEffect(() => {
    if (+currentQuantity > 0) {
      setQuantity(currentQuantity.toFixed(2).toString());
      setCounter?.(currentQuantity);
    } else {
      setQuantity('0');
      setCounter?.(0);
    }
  }, [currentQuantity, setCounter]);

  const onBlurInput = () => {
    if (currentQuantity.toString() === quantity.toString()) {
      return;
    }
    if (+quantity <= 0 && currentQuantity > 0) {
      setIsModalVisible(true);
    } else {
      onChangeText?.({ id, quantity });
      setQuantity('0');
      setCounter?.(0);
    }
  };
  const inputRef = useRef<TextInput>(null);
  return (
    <View style={styles().container}>
      <Button
        onPress={() => {
          if (onDecrease) {
            onDecrease(id);
            setQuantity(prev => {
              if (+prev >= 1) {
                return (+prev - 1).toFixed(2);
              }
              return +prev - 1 < 1 ? '0' : prev;
            });
            if (setCounter) {
              setCounter(prev => {
                if (+prev >= 1) {
                  return +prev - 1;
                }
                return +prev - 1 < 1 ? 0 : prev;
              });
            }
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
        onPress={e => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}>
        <TextInput
          autoCapitalize="none"
          ref={inputRef}
          maxLength={5}
          allowFontScaling={false}
          value={numberWithCommas(quantity, true).toString()}
          keyboardType="numeric"
          style={{
            fontFamily: 'NotoSansThai-Bold',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            textAlignVertical: 'center',
            height: 40,
            marginTop: 2,
            minWidth: 40,
          }}
          onChangeText={text => {
         
            const value = text.replace(/[^0-9.]/g, '');
            setQuantity(value);
            if (setCounter) {
              setCounter(+value);
            }
          }}
          onBlur={onBlurInput}
        />
      </Pressable>
      <Button
        onPress={() => {
          onIncrease?.(id);
          setQuantity(prev => {
            return (+prev + 1).toString();
          });
          if (setCounter) {
            setCounter(prev => {
              return prev + 1;
            });
          }
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
      <ModalWarning
        title={t('modalWarning.cartDeleteTitle')}
        desc={t('modalWarning.cartDeleteDesc')}
        visible={isModalVisible}
        onConfirm={() => {
          setIsModalVisible(false);
          onChangeText?.({ id, quantity });
          setCounter?.(0);
        }}
        onRequestClose={() => {
          setIsModalVisible(false);
          setQuantity(currentQuantity.toString());
          setCounter?.(currentQuantity);
          onChangeText?.({
            id,
            quantity: currentQuantity.toString(),
          });
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
