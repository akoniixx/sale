import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { numberWithCommas } from '../../utils/functions';
import ModalWarning from '../../components/Modal/ModalWarning';
import { useLocalization } from '../../contexts/LocalizationContext';
interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: ({ id, quantity }: { quantity: string; id?: any }) => void;
  id: string | number;
  onIncrease?: (id: string | number) => void;
  onDecrease?: (id: string | number) => void;
}
const CounterSmall = ({
  currentQuantity = 0,
  onChangeText,
  onDecrease,
  onIncrease,
  id,
}: Props): JSX.Element => {
  const [quantity, setQuantity] = React.useState('0');
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const { t } = useLocalization();
  const inputRef = useRef<TextInput>(null);

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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
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
      <TextInput
        value={numberWithCommas(quantity).toString()}
        keyboardType="number-pad"
        ref={inputRef}
        style={{
          fontFamily: 'NotoSansThai-Bold',
          fontSize: 12,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minWidth: 20,
          padding: 0,
        }}
        onChangeText={text => {
          const onlyNumber = text.replace(/[^0-9]/g, '');
          setQuantity(onlyNumber);
        }}
        returnKeyType="done"
        onSubmitEditing={() => {
          if (+quantity < 1 && currentQuantity > 0) {
            setIsModalVisible(true);
          } else {
            onChangeText?.({ id, quantity });
          }
        }}
        onBlur={onBlurInput}
      />
      <TouchableOpacity
        style={styles.button}
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
          setQuantity(currentQuantity.toString());
          onChangeText?.({
            id,
            quantity: currentQuantity.toString(),
          });
        }}
      />
    </View>
  );
};

export default CounterSmall;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 105,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
