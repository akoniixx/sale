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
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';
import { numberWithCommas } from '../../utils/functions';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import ModalMessage from '../../components/Modal/ModalMessage';
import { useCart } from '../../contexts/CartContext';
import Counter from '../../components/Counter/Counter';

interface Props {
  image?: string;
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
  ...props
}: Props): JSX.Element {
  const isPromo = props?.index % 2 === 0;
  const price = props.price || 14000;
  const name = props.index % 2 === 0 ? 'ไฮซีส' : 'ไซม๊อกซิเมท';
  const unit = props?.index % 2 === 0 ? 'ลัง' : 'กระสอบ';
  const detail = '40*500 cc';
  const { t } = useLocalization();
  const { setCartList, cartList } = useCart();

  const isAlreadyInCart = cartList?.find(
    (item: { id: string | number }) =>
      item?.id.toString() === idItem.toString(),
  );
  const onChangeText = (text: string, id: string) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string }) => item?.id === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(text);
      setCartList(newCartList);
    }
  };
  const onAddCartByIndex = (id: string | number) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id === id,
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];

      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
    }
  };
  const onSubtractCartByIndex = (id: string | number) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id === id,
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
        <Image
          source={images.mockImage}
          style={{
            width: '100%',
            height: 100,
          }}
        />
        <View
          style={{
            marginBottom: Platform.OS === 'ios' ? 8 : 0,
          }}>
          <Text fontFamily="Sarabun" semiBold>
            {name}
          </Text>
          <Text fontFamily="Sarabun" numberOfLines={1} color="text2">
            EMAMECTIN BENZOATE 2 Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Error, culpa quod aperiam ab maiores fugit quos
            obcaecati, modi saepe accusantium expedita vitae voluptate
            cupiditate officiis autem molestiae? Autem, illo? Praesentium.
          </Text>
          <Text color="text3">{detail}</Text>
          <Text fontSize={18} bold>
            {t('screens.StoreDetailScreen.price', {
              price: numberWithCommas(price),
            })}
            <Text color="text3"> /{unit}</Text>
          </Text>
        </View>
        {!!isAlreadyInCart ? (
          <Counter
            id={isAlreadyInCart.id}
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
                    id: idItem,
                    name: name,
                    price: price,
                    amount: 5,
                    image: images.mockImage,
                    promotion: 100000,
                    unit: unit,
                    detail,
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
      minHeight: 200,
    },
  });
};
