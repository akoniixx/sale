import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import Counter from '../../components/Counter/Counter';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import icons from '../../assets/icons';

interface Props {
  id: string;
  setIsAddCart: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelCart: React.Dispatch<React.SetStateAction<boolean>>;
  image?: ImageSourcePropType;
  name?: string;
  detail?: string;
  price?: number;
  promotion?: number;
  unit?: string;
}
export default function Footer({
  id,
  setIsAddCart,
  setIsDelCart,
  image,
  name,
  detail,
  price,
  unit,
  promotion,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const { cartList, setCartList } = useCart();

  const currentProduct = cartList?.find(
    (item: { id: string }) => item?.id.toString() === id,
  );
  const onChangeText = (text: string, id: string) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string }) => item?.id.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(text);
      setCartList(newCartList);
    } else {
      setCartList([
        ...cartList,
        {
          id,
          amount: Number(text),
        },
      ]);
    }
  };
  const onIncrease = () => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
    } else {
      setCartList([
        ...cartList,
        { id, amount: 5, image, name, detail, price, promotion, unit },
      ]);
    }
    setIsAddCart(true);
  };
  const onDecrease = () => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id.toString() === id,
    );

    if (findIndex !== -1) {
      const newCartList = [...cartList];
      const amount = newCartList[findIndex].amount;
      if (amount > 5) {
        newCartList[findIndex].amount -= 5;
        setCartList(newCartList);
      } else {
        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        setIsDelCart(true);
      }
    }
  };
  const onOrder = () => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
    } else {
      setCartList([
        ...cartList,
        { id, amount: 5, image, name, detail, price, promotion, unit },
      ]);
    }
    setIsAddCart(true);
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
    },
  });
};
