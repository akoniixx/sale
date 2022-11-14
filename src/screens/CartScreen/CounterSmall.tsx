import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
interface Props {
  currentQuantity: number;
  onBlur?: () => void;
  onChangeText?: (text: string, id?: any) => void;
  id: string | number;
  onIncrease?: (id: string | number) => void;
  onDecrease?: (id: string | number) => void;
}
const CounterSmall = ({
  currentQuantity = 0,
  onChangeText,
  onBlur,
  onDecrease,
  onIncrease,
  id,
}: Props): JSX.Element => {
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
        value={currentQuantity.toString()}
        keyboardType="number-pad"
        style={{
          fontFamily: 'NotoSansThai-Bold',
          fontSize: 12,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',

          padding: 0,
        }}
        onChangeText={text => onChangeText?.(text, id)}
        onBlur={onBlur}
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
