import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
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
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '../../hook';
import { err } from 'react-native-svg/lib/typescript/xml';

interface Props extends ProductType {
  name?: string;
  desc?: string;
  amount?: number;
  price?: number;
  index: number;
  onPressCart?: () => void;
  setIsAddCart: (v: boolean) => void;
  setIsDelCart: (v: boolean) => void;
  setIsError: (v: boolean) => void;
  setErrorMessege: (v:any) => void
  navigation: any;
  idItem: string;
  promotion?: any;
}
export default function Item({
  setIsAddCart,
  setIsDelCart,
  setIsError,
  setErrorMessege,
  navigation,
  idItem,
  productName,
  unitPrice,
  productImage,
  promotion,
  ...props
}: Props): JSX.Element {
  const [notFirstFetch, setIsNotFirstFetch] = React.useState(false);
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
  const {
    state: { user },
  } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const isAlreadyInCart = useMemo(() => {
    return cartList?.find(
      item => item?.productId.toString() === idItem.toString(),
    );
  }, [cartList, idItem]);
  const [currentCount] = useDebounce(isAlreadyInCart?.amount, 500);

  useEffect(() => {
    const updateAmountCart = async () => {
      try {
        if (currentCount > 5) {
          setLoading(true);
        }

        await postCartItem(cartList);
      } catch (e) {
        console.log(e);
      } finally {
        if (currentCount > 5) {
          setLoading(false);
        }
        setIsNotFirstFetch(false);
      }
    };
    if (currentCount && notFirstFetch) {
      updateAmountCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCount]);

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
    }
    setIsNotFirstFetch(true);
  };
  const onAddCartByIndex = async (id: string | number) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);

    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
      setIsNotFirstFetch(true);
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
        setIsNotFirstFetch(true);
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
            zIndex: 1,
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
          {user?.company === 'ICPL' && (
            <Text
              color="text1"
              bold
              style={{
                height: 28,
              }}>
              {`฿${numberWithCommas(unitPrice)}`}
              <Text color="text3">
                /{props?.baseUOM ? props?.baseUOM : 'Unit'}
              </Text>
            </Text>
          )}
          <Text fontSize={18} bold>
            {t('screens.StoreDetailScreen.price', {
              price: numberWithCommas(+props.marketPrice),
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
             
              try {
                const res =  await postCartItem(newCartList);
                setCartList(newCartList);
                setIsAddCart(true);
              } catch (error:any) {
                setIsError(true)
                setErrorMessege(error.message)
                console.log(error,'from catch')
              }
           
           
            
              
              props.onPressCart && props.onPressCart();
            }}
            style={{
              height: 40,
              paddingVertical: 10,
            }}
          />
        )}
      </View>
      <LoadingSpinner visible={loading} setLoading={setLoading} />
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
