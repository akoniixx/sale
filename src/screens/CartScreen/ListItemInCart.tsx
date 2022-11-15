import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import { numberWithCommas } from '../../utils/functions';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import CounterSmall from './CounterSmall';

interface Item {
  id: string;
  amount: number;
  image: ImageSourcePropType;
  name: string;
  detail: string;
  price: number;
  unit: string;
}
export default function ListItemInCart() {
  const { t } = useLocalization();
  const { cartList, setCartList } = useCart();
  const onIncrease = (id: string | number) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
    }
  };
  const onDecrease = (id: string | number) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string | number }) => item?.id.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount -= 5;
      setCartList(newCartList);
    }
  };
  const onChangeText = (text: string, id: string) => {
    const findIndex = cartList?.findIndex(
      (item: { id: string }) => item?.id.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(text);
      setCartList(newCartList);
    }
  };
  const onDelete = (id: string | number) => {
    const newCartList = cartList?.filter(
      (item: { id: string | number }) => item?.id.toString() !== id.toString(),
    );
    setCartList(newCartList);
  };
  return (
    <View style={styles.container}>
      <Text fontFamily="NotoSans" fontSize={18} bold>
        {t('screens.CartScreen.listProduct', {
          count: cartList.length,
        })}
      </Text>
      {cartList.length > 0 ? (
        <View>
          {cartList.map((item: Item) => {
            return (
              <View
                key={item.id}
                style={{
                  marginTop: 16,
                }}>
                <View style={styles.containerItem}>
                  <View style={styles.containerLeft}>
                    <Image
                      source={item.image}
                      style={{
                        width: 62,
                        height: 62,
                        marginRight: 10,
                      }}
                    />
                    <View style={styles.item}>
                      <Text fontFamily="NotoSans" fontSize={16} bold>
                        {item.name}
                      </Text>
                      <Text fontFamily="NotoSans" fontSize={14} color="text3">
                        {`${item.detail} | ฿${numberWithCommas(item.price)}/${
                          item.unit
                        }`}
                      </Text>
                      <Text fontSize={14} color="text2">
                        {`฿${numberWithCommas(item.price)}/${item.unit} x ${
                          item.amount
                        } `}
                        <Text fontSize={12} color="current">
                          {t('screens.CartScreen.discount', {
                            discount: numberWithCommas(
                              item.price * item.amount * 0.1,
                            ),
                          })}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.buttonDel}
                    onPress={() => {
                      onDelete(item.id);
                    }}>
                    <Image
                      source={icons.bin}
                      style={{
                        width: 15,
                        height: 17,
                        marginBottom: 2,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        width: 62,
                        marginRight: 10,
                      }}
                    />
                    <CounterSmall
                      currentQuantity={item.amount}
                      onChangeText={onChangeText}
                      onIncrease={onIncrease}
                      onDecrease={onDecrease}
                      id={item.id}
                    />
                  </View>
                  <Text bold fontFamily="NotoSans">
                    {`฿${numberWithCommas(item.price * item.amount)}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            minHeight: 200,
          }}></View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonDel: {
    width: 26,
    height: 26,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {},
});
