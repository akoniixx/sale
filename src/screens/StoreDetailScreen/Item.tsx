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
}
export default function Item({
  setIsAddCart,
  setIsDelCart,
  navigation,
  idItem,
  productName,
  unitPrice,
  productImage,
  ...props
}: Props): JSX.Element {
  const isPromo = false;

  const { t } = useLocalization();
  const { setCartList, cartList } = useCart();

  const isAlreadyInCart = cartList?.find(
    item => item?.productId.toString() === idItem.toString(),
  );
  const onChangeText = (text: string, id: string) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);

    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(text);
      setCartList(newCartList);
    }
  };
  const onAddCartByIndex = (id: string | number) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);

    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
    }
  };
  const onSubtractCartByIndex = (id: string | number) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);

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
        {productImage ? (
          <View
            style={{
              height: 100,
              marginBottom: 8,
            }}>
            <Image
              source={{ uri: getNewPath(productImage) }}
              style={{
                height: 100,
              }}
              resizeMode="contain"
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
            <Text color="text3"> /{props.baseUOM}</Text>
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
            onPress={() => {
              setIsAddCart(true);
              setCartList((prev: any) => {
                return [
                  ...prev,
                  {
                    ...props,
                    productId: idItem,
                    productName,
                    unitPrice,
                    amount: 5,
                    productImage,
                    order: prev.length + 1,
                  },
                ];
              });
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
