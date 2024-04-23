import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../../../assets/colors/colors';
import icons from '../../../assets/icons';
import { useLocalization } from '../../../contexts/LocalizationContext';
import ModalWarning from '../../../components/Modal/ModalWarning';
import { numberWithCommas } from '../../../utils/functions';

interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: (value: { quantity: string; id?: any }) => void;
  maxQuantity: number;
  id: string;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  disable?: boolean;
}
const CounterOrderLoads = ({
  currentQuantity = 0,
  onChangeText,
  onDecrease,
  onIncrease,
  id,
  disable,
  maxQuantity,
}: Props): JSX.Element => {
  const [quantity, setQuantity] = React.useState<string>('0.00');
  const { t } = useLocalization();
  const inputRef = useRef<any>();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const onBlurInput = () => {
    onChangeText?.({ id, quantity });
    /* 
    if (+quantity < 1 && currentQuantity > 0) {
      setIsModalVisible(true);
    } else {
      onChangeText?.({ id, quantity });
    } */
  };

  useEffect(() => {
    if (+currentQuantity > 0) {
      setQuantity(currentQuantity.toFixed(2).toString());
    } else {
      setQuantity('0.00');
    }
  }, [currentQuantity]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: disable ? '#E1E7F6' : 'white' },
      ]}>
      <TouchableOpacity
        disabled={disable}
        style={[
          styles.button,
          { backgroundColor: disable ? '#E1E7F6' : colors.primary },
        ]}
        onPress={() => {
          if (onDecrease) {
            onDecrease(id);
          }
        }}>
        <Image
          source={icons.iconMinusWhite}
          style={{
            width: 10,
            height: 10,
          }}
        />
      </TouchableOpacity>
      <Pressable
        disabled={disable}
        onPress={e => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}>
        <TextInput
          ref={inputRef}
          value={numberWithCommas(quantity, true).toString()}
          keyboardType="numeric"
          style={{
            fontFamily: 'NotoSansThai-Bold',
            fontSize: 12,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',

            padding: 0,
          }}
          onChangeText={text => {
            if (+text > maxQuantity) {
              setQuantity(maxQuantity.toFixed(2).toString());
            } else {
              const convertedTextToDecimal = text.replace(/[^0-9.]/g, '');
              const onlyTwoDecimal = convertedTextToDecimal.split('.');
              const toFixed =
                onlyTwoDecimal.length > 1
                  ? onlyTwoDecimal[0] + '.' + onlyTwoDecimal[1].slice(0, 2)
                  : convertedTextToDecimal;
              setQuantity(toFixed);
            }
          }}
          onBlur={onBlurInput}
        />
      </Pressable>

      <TouchableOpacity
        disabled={disable}
        style={[
          styles.button,
          { backgroundColor: disable ? '#E1E7F6' : colors.primary },
        ]}
        onPress={() => {
          if (onIncrease) {
            onIncrease(id);
          }
        }}>
        <Image
          source={icons.iconAddWhite}
          style={{
            width: 16,
            height: 16,
          }}
        />
      </TouchableOpacity>
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
          setQuantity(currentQuantity.toFixed(2).toString());
          onChangeText?.({
            id,
            quantity: currentQuantity.toFixed(2).toString(),
          });
        }}
      />
    </View>
  );
};

export default CounterOrderLoads;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 15,
    paddingHorizontal: 4,
    height: 30,
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
