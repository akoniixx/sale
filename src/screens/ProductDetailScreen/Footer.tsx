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
  setIsError: (v: boolean) => void;
  setErrorMessege: (v: string) => void;
  isError: boolean;
}
export default function Footer({
  id,
  setIsAddCart,
  setIsDelCart,
  setIsError,
  setErrorMessege,
  navigation,
  productItem,
  setLoading,
  isError,
}: Props): JSX.Element {
  const { t } = useLocalization();

  const [currentCount, setCurrentCount] = useState(0);
  const [error, setError] = useState(false);
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem },
  } = useCart();
  const currentProduct = cartList?.find(
    item => item?.productId.toString() === id,
  );

  const [debounceCount, loading] = useDebounce(currentProduct?.amount, 500);

  useEffect(() => {
    if (currentProduct) {
      setCurrentCount(currentProduct.amount);
    }
  }, [currentProduct]);

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
    if (!error) {
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

        try {
          const res = await postCartItem(newCartList);
          setIsAddCart(true);
          setCartList(newCartList);
        } catch (error: any) {
          setIsError(true);
          setErrorMessege(error.message);
          console.log(error, 'from catch detail');
        }
      }
    }
  };
  const onIncrease = async () => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;
      try {
        setLoading(true);
        await postCartItem(newCartList);
        setIsAddCart(true);
        setCartList(newCartList);
      } catch (error: any) {
        setIsError(true);
        setErrorMessege(error.message);
        console.log(error, 'from catch detail');
      } finally {
        setLoading(false);
      }
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
      try {
        const res = await postCartItem(newCartList);
        setIsAddCart(true);
        setCartList(newCartList);
      } catch (error: any) {
        setIsError(true);
        setErrorMessege(error.message);
        console.log(error, 'from catch detail');
      } finally {
      }
    }
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
      } else {
        newCartList.splice(findIndex, 1);
        setCartList(newCartList);
        setIsDelCart(true);
        await postCartItem(newCartList);
      }
    }
  };
  const onOrder = async () => {
    // setDisabledButton(true);
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id,
    );

    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = currentCount;
      setCartList(newCartList);
      await postCartItem(newCartList);
      navigation.navigate('CartScreen');
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

      try {
        const res = await postCartItem(newCartList);
        setIsAddCart(true);
        setCartList(newCartList);
        navigation.navigate('CartScreen');
      } catch (error: any) {
        console.log;
        setError(true);
        setIsError(true);
        setErrorMessege(error.message);
      }

      /*  setCartList(newCartList);
        await postCartItem(newCartList); */
    }
    // setIsAddCart(true);
    // setDisabledButton(false);
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
