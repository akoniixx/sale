import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import Counter from '../../components/Counter/Counter';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import icons from '../../assets/icons';
import { ProductSummary } from '../../entities/productType';

interface Props {
  id: string;
  navigation: any;
  setIsAddCart: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelCart: React.Dispatch<React.SetStateAction<boolean>>;
  productItem: ProductSummary;
}
export default function Footer({
  id,
  setIsAddCart,
  setIsDelCart,
  navigation,
  productItem,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const currentProduct = cartList?.find(
    item => item?.productId.toString() === id,
  );
  const onChangeText = async (text: string, id: string) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(text);
      setCartList(newCartList);
      await postCartItem(newCartList);
    } else {
      const newCartList = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          amount: Number(text),
          order: cartList.length + 1,
        },
      ];
      await postCartItem(newCartList);
      setCartList(newCartList);
    }
  };
  const onIncrease = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;

      setCartList(newCartList);
      await postCartItem(newCartList);
    } else {
      const newCartList = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          amount: 5,
          order: cartList.length + 1,
        },
      ];
      setCartList(newCartList);
      await postCartItem(newCartList);
    }
    setIsAddCart(true);
  };
  const onDecrease = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );

    if (findIndex !== -1) {
      const newCartList = [...cartList];
      const amount = newCartList[findIndex].amount;
      if (amount > 5) {
        newCartList[findIndex].amount -= 5;
        setCartList(newCartList);
        await postCartItem(newCartList);
      } else {
        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        setIsDelCart(true);
        await postCartItem(newCartList);
      }
    }
  };
  const onOrder = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount += 5;
      newCartList[findIndex].order = newCartList.length + 1;
      setCartList(newCartList);
      await postCartItem(newCartList);
    } else {
      const newCartList = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          amount: 5,
          order: cartList?.length + 1,
        },
      ];
      setCartList(newCartList);
      await postCartItem(newCartList);
    }
    setIsAddCart(true);
    navigation.navigate('CartScreen');
  };
  return (
    <View style={styles().container}>
      <View
        style={{
          flex: 0.8,
        }}>
        <Counter
          currentQuantity={currentProduct?.amount ? currentProduct.amount : 0}
          id={id}
          onChangeText={onChangeText}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </View>
      <View
        style={{
          flex: 0.2,
        }}
      />
      <View
        style={{
          flex: 0.8,
        }}>
        <Button
          title={t('screens.ProductDetailScreen.orderButton')}
          onPress={onOrder}
          iconBack={
            <Image
              source={icons.cartFill}
              style={{
                width: 24,
                height: 24,
                marginLeft: 8,
              }}
            />
          }
        />
      </View>
    </View>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      padding: 16,
      height: 82,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 1.62,
      elevation: 14,
    },
  });
};
