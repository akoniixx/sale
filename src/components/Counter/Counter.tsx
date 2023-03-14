import { StyleSheet, TextInput, Image, View, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import icons from '../../assets/icons';
import { debounce } from 'lodash';
import { useLocalization } from '../../contexts/LocalizationContext';
import ModalWarning from '../Modal/ModalWarning';
import { numberWithCommas } from '../../utils/functions';

interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: ({ id, quantity }: { quantity: string; id?: any }) => void;
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
  const [quantity, setQuantity] = useState('0');
  const { t } = useLocalization();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  useEffect(() => {
    if (+currentQuantity > 0) {
      setQuantity(currentQuantity.toString());
    } else {
      setQuantity('0');
    }
  }, [currentQuantity]);
  // const debouncedSearch = useRef(
  //   debounce(quantity => {
  //     if (+quantity < 1 && currentQuantity > 0) {
  //       setIsModalVisible(true);
  //     } else {
  //       onChangeText?.({ id, quantity });
  //     }
  //   }, 1000),
  // ).current;
  const onBlurInput = () => {
    if (currentQuantity.toString() === quantity.toString()) {
      return;
    }
    if (+quantity < 1 && currentQuantity > 0) {
      setIsModalVisible(true);
    } else {
      onChangeText?.({ id, quantity });
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
              if (+prev > 0) {
                return (+prev - 5).toFixed(2);
              }
              return +prev < 1 ? '0.00' : prev;
            });
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
          value={numberWithCommas(quantity).toString()}
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
          }}
          onBlur={onBlurInput}
        />
      </Pressable>
      <Button
        onPress={() => {
          onIncrease?.(id);
          setQuantity(prev => {
            return (+prev + 5).toString();
          });
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
        }}
        onRequestClose={() => {
          setIsModalVisible(false);
          setQuantity(currentQuantity.toString());
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
