import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import { useLocalization } from '../../contexts/LocalizationContext';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import { useCart } from '../../contexts/CartContext';
import Counter from '../../components/Counter/Counter';
import { ProductType } from '../../entities/productType';
import images from '../../assets/images';
import FastImage from 'react-native-fast-image';

interface Props extends ProductType {
  name?: string;
  desc?: string;
  amount?: number;
  price?: number;
  index: number;
  onPressCart?: () => void;
  setIsAddCart: (v: boolean) => void;
  setIsDelCart: (v: boolean) => void;
  navigation: any;
  idItem: string;
  promotion?: any;
}
export default function Item({
  setIsAddCart,
  setIsDelCart,
  navigation,
  idItem,
  productName,
  unitPrice,
  productImage,
  promotion,
  ...props
}: Props): JSX.Element {
  const isPromo = promotion && promotion?.length > 0;
  const orderProductPromotions = promotion?.map((el: any) => {
    return {
      promotionId: el?.promotionId,
      isUse: true,
    };
  });

  const { t } = useLocalization();
  const {
    setCartList,
    cartList,
    cartApi: { postCartItem },
  } = useCart();

  const isAlreadyInCart = cartList?.find(
    item => item?.productId.toString() === idItem.toString(),
  );
  const onChangeText = async ({
    quantity,
    id,
  }: {
    quantity: string;
    id?: any;
  }) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);
    if (+quantity < 1 && findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList.splice(findIndex, 1);
      setCartList(newCartList);
      await postCartItem(newCartList);
      setIsDelCart(true);
      return null;
    }
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(quantity);
      setCartList(newCartList);
      await postCartItem(newCartList);
    }
  };
  const onAddCartByIndex = async (id: string | number) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);

    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;
      setCartList(newCartList);

      await postCartItem(newCartList);
    }
  };
  const onSubtractCartByIndex = async (id: string | number) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);

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

  return (
    <TouchableOpacity
      style={styles().container}
      onPress={() => {
        navigation.navigate('ProductDetailScreen', {
          id: idItem,
        });
      }}>
      {isPromo && (
        <Image
          source={icons.promoIcon}
          style={{
            width: 45,
            height: 18,
            position: 'absolute',
            right: 16,
            top: 8,
          }}
        />
      )}
      <View>
        {!!productImage ? (
          <View
            style={{
              height: 100,
              marginBottom: 8,
            }}>
            <FastImage
              source={{
                uri: getNewPath(productImage),
                priority: FastImage.priority.normal,
              }}
              style={{
                height: 100,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        ) : (
          <View
            style={{
              height: 100,

              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <Image
              source={images.emptyProduct}
              style={{
                height: 90,
                width: 90,
              }}
            />
          </View>
        )}
        <View
          style={{
            marginBottom: 8,
          }}>
          <Text
            fontFamily="Sarabun"
            semiBold
            numberOfLines={1}
            style={{
              height: 26,
            }}>
            {productName}
          </Text>

          <Text
            fontFamily="Sarabun"
            style={{
              height: 24,
            }}
            numberOfLines={1}
            color="text2">
            {props.commonName}
          </Text>
          {!!props.packSize ? (
            <Text
              color="text3"
              style={{
                height: 28,
              }}>
              {props.packSize}
            </Text>
          ) : (
            <View
              style={{
                height: 28,
              }}
            />
          )}
          <Text fontSize={18} bold>
            {t('screens.StoreDetailScreen.price', {
              price: numberWithCommas(+unitPrice),
            })}
            {props?.saleUOMTH && (
              <Text color="text3"> /{props?.saleUOMTH}</Text>
            )}
          </Text>
        </View>
        {!!isAlreadyInCart ? (
          <Counter
            id={isAlreadyInCart.productId}
            onDecrease={onSubtractCartByIndex}
            onIncrease={onAddCartByIndex}
            currentQuantity={+isAlreadyInCart.amount}
            onChangeText={onChangeText}
          />
        ) : (
          <Button
            title={t('screens.StoreDetailScreen.buttonAddCart')}
            secondary
            iconFont={
              <Image
                source={icons.iconAdd}
                style={{
                  width: 26,
                  height: 26,
                  marginRight: 4,
                }}
              />
            }
            onPress={async () => {
              const newCartList: any = [
                ...cartList,
                {
                  ...props,
                  promotion,
                  productId: idItem,
                  productName,
                  unitPrice,
                  amount: 5,
                  productImage,
                  order: cartList.length + 1,
                  orderProductPromotions,
                },
              ];
              setIsAddCart(true);

              setCartList(newCartList);
              await postCartItem(newCartList);
              props.onPressCart && props.onPressCart();
            }}
            style={{
              height: 40,
              paddingVertical: 10,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border1,
      borderRadius: 12,
      padding: Platform.OS === 'ios' ? 16 : 10,
      width: '48%',
      marginBottom: 8,
    },
  });
};
