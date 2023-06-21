import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Counter from '../../components/Counter/Counter';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import icons from '../../assets/icons';
import { ProductSummary } from '../../entities/productType';
import { useDebounce } from '../../hook';

interface Props {
  id: string;
  navigation: any;
  setIsAddCart: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelCart: React.Dispatch<React.SetStateAction<boolean>>;
  productItem: ProductSummary;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Footer({
  id,
  setIsAddCart,
  setIsDelCart,
  navigation,
  productItem,
  setLoading,
}: Props): JSX.Element {
  const { t } = useLocalization();

  const [currentCount, setCurrentCount] = useState(0);
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const currentProduct = cartList?.find(
    item => item?.productId.toString() === id,
  );
  const [notFirstFetch, setIsNotFirstFetch] = React.useState(false);

  const [debounceCount, loading] = useDebounce(currentProduct?.amount, 500);

  useEffect(() => {
    if (currentProduct) {
      setCurrentCount(currentProduct.amount);
    }
  }, [currentProduct]);

  useEffect(() => {
    const updateAmount = async () => {
      try {
        setLoading(true);

        await postCartItem(cartList);

        setIsAddCart(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (debounceCount && notFirstFetch) {
      updateAmount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceCount]);

  const promotionIdList = (productItem?.promotion || []).map(el => {
    return {
      promotionId: el?.promotionId,
      isUse: true,
    };
  });
  const onChangeText = async ({
    quantity,
    id,
  }: {
    quantity: string;
    id?: any;
  }) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      if (+quantity < 1) {
        setLoading(true);

        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        await postCartItem(newCartList);
        setIsDelCart(true);
        setLoading(false);

        return;
      } else {
        newCartList[findIndex].amount = Number(quantity);
        setCartList(newCartList);
        setIsNotFirstFetch(true);
      }
    } else {
      const newCartList: any = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          amount: Number(quantity),
          orderProductPromotions: promotionIdList || [],
          order: cartList.length + 1,
        },
      ];
      setCartList(newCartList);
      setLoading(false);
      setIsNotFirstFetch(true);
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
    } else {
      const newCartList: any = [
        ...cartList,
        {
          ...productItem,
          productId: id,
          amount: 5,
          orderProductPromotions: promotionIdList,
          order: cartList.length + 1,
        },
      ];
      setCartList(newCartList);
    }
    setIsNotFirstFetch(true);
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
        setIsNotFirstFetch(true);
      } else {
        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        setIsDelCart(true);
        await postCartItem(newCartList);
      }
    }
  };
  const onOrder = async () => {
    try {
      // setDisabledButton(true);
      const findIndex = cartList?.findIndex(
        item => item?.productId.toString() === id,
      );

      if (findIndex !== -1) {
        const newCartList = [...cartList];
        newCartList[findIndex].amount = currentCount;
        setCartList(newCartList);
        await postCartItem(newCartList);
      } else {
        const newCartList: any = [
          ...cartList,
          {
            ...productItem,
            productId: id,
            amount: currentCount,
            orderProductPromotions: promotionIdList,
            order: cartList?.length + 1,
          },
        ];
        setCartList(newCartList);
        await postCartItem(newCartList);
      }
      // setIsAddCart(true);
      // setDisabledButton(false);

      navigation.navigate('CartScreen');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles().container}>
      <View
        style={{
          flex: 0.8,
        }}>
        <Counter
          currentQuantity={currentProduct?.amount ? +currentProduct?.amount : 0}
          id={id}
          onChangeText={onChangeText}
          onDecrease={onDecrease}
          setCounter={setCurrentCount}
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
          onPress={onOrder}
          disabled={currentCount <= 0 || loading}
          title={t('screens.ProductDetailScreen.orderButton')}
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
