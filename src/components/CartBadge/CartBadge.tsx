import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';
import { useCart } from '../../contexts/CartContext';
interface Props {
  navigation: any;
}
const CartBadge = ({ navigation }: Props): JSX.Element => {
  const { cartList = [] } = useCart();
  const length = cartList.length || 0;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CartScreen');
      }}>
      <View style={styles(length).count}>
        <Text fontSize={12} color="white" lineHeight={14}>
          {length}
        </Text>
      </View>

      <Image
        source={icons.cart}
        style={{
          width: 32,
          height: 32,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = (length = 0) =>
  StyleSheet.create({
    count: {
      position: 'absolute',
      right: 0,
      top: 2,
      backgroundColor: colors.primary,
      width: 15,
      height: 15,
      borderRadius: 7,
      zIndex: 20,
      justifyContent: 'center',
      alignItems: 'center',
      display: length > 0 ? 'flex' : 'none',
    },
  });
export default CartBadge;
