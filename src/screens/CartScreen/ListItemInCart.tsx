import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import CounterSmall from './CounterSmall';
import images from '../../assets/images';
import Dropdown from '../../components/Dropdown/Dropdown';

export default function ListItemInCart() {
  const { t } = useLocalization();
  const { cartList, setCartList } = useCart();
  const isPromotion = true;

  const onChangeOrder = (value: any, id: string) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].order = Number(value);

      setCartList(newCartList);
    }
  };

  const onIncrease = (id: string | number) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount += 5;
      setCartList(newCartList);
    }
  };
  const onDecrease = (id: string | number) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount -= 5;
      setCartList(newCartList);
    }
  };
  const onChangeText = (text: string, id: string) => {
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      newCartList[findIndex].amount = Number(text);
      setCartList(newCartList);
    }
  };
  const onDelete = (id: string | number) => {
    const newCartList = cartList?.filter(
      item => item?.productId.toString() !== id.toString(),
    );
    setCartList(newCartList);
  };
  const itemsDropdown = useMemo(() => {
    console.log('cartList');
    return cartList.map((el, idx) => {
      return {
        key: idx + 1,
        value: idx + 1,
      };
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text fontFamily="NotoSans" fontSize={18} bold>
        {t('screens.CartScreen.listProduct', {
          count: cartList.length,
        })}
        <Text fontSize={14} color="text3">
          {`   ${t('screens.CartScreen.tooltip')}`}
        </Text>
      </Text>
      {cartList.length > 0 ? (
        <View>
          {cartList.map(item => {
            return (
              <View
                key={item.productId}
                style={{
                  marginTop: 16,
                }}>
                <View style={styles.containerItem}>
                  <View style={styles.containerLeft}>
                    {item?.productImage ? (
                      <Image
                        source={{ uri: getNewPath(item?.productImage) }}
                        style={{
                          width: 62,
                          height: 62,
                          marginRight: 10,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 62,
                          height: 62,
                          marginRight: 10,
                        }}>
                        <Image
                          style={{
                            width: 56,
                            height: 56,
                          }}
                          source={images.emptyProduct}
                        />
                      </View>
                    )}
                    <View style={styles.item}>
                      <Text fontFamily="NotoSans" fontSize={16} bold>
                        {item.productName}
                      </Text>
                      <Text fontFamily="NotoSans" fontSize={14} color="text3">
                        {item.packSize
                          ? `${item.packSize} | ฿${numberWithCommas(
                              +item.unitPrice,
                            )}/${item.baseUOM}`
                          : `฿${numberWithCommas(+item.unitPrice)}/${
                              item.baseUOM
                            }`}
                      </Text>
                      <Text fontSize={14} color="text2">
                        {`฿${numberWithCommas(+item.unitPrice)}/${
                          item.baseUOM
                        } x ${item.amount} `}
                      </Text>
                      <Dropdown />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.buttonDel}
                    onPress={() => {
                      onDelete(item.productId);
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
                      id={item.productId}
                    />
                  </View>
                  <View>
                    {isPromotion && (
                      <Text
                        fontFamily="NotoSans"
                        color="text3"
                        style={{
                          textDecorationStyle: 'solid',
                          textDecorationLine: isPromotion
                            ? 'line-through'
                            : 'none',
                        }}>
                        {`฿${numberWithCommas(+item.unitPrice * item.amount)}`}
                      </Text>
                    )}
                    <Text bold fontFamily="NotoSans">
                      {`฿${numberWithCommas(+item.unitPrice * item.amount)}`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            minHeight: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={images.emptyProduct}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Text
            style={{
              marginTop: 4,
            }}
            color="text3"
            fontFamily="NotoSans">
            {t('screens.CartScreen.emptyCart')}
          </Text>
        </View>
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
