import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useMemo } from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { newProductType, useCart } from '../../contexts/CartContext';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import CounterSmall from './CounterSmall';
import images from '../../assets/images';
import Dropdown from '../../components/Dropdown/Dropdown';
import PromotionSection from './PromotionSection';

import ModalWarning from '../../components/Modal/ModalWarning';
import ModalMessage from '../../components/Modal/ModalMessage';
import ImageCache from '../../components/ImageCache/ImageCache';
import GiftFromPromotion from './GiftFromPromotion';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const reArrangeShipment = (dataList: newProductType[]) => {
  return dataList.map((item, index) => {
    return {
      ...item,
      order: index + 1,
    };
  });
};
export default function ListItemInCart() {
  const { t } = useLocalization();
  const [loading, setLoading] = React.useState(false);
  const {
    cartList,
    cartDetail,
    setCartList,
    promotionList,
    freebieListItem,
    cartApi: { postCartItem, getSelectPromotion },
  } = useCart();

  const [visibleDel, setVisibleDel] = React.useState(false);
  const [delId, setDelId] = React.useState<string | number>('');
  const onChangeOrder = async (value: any, id: string) => {
    const findIndex = cartList?.findIndex(item => item?.productId === id);
    const findOrder = cartList?.findIndex(item => +item?.order === +value);
    if (findOrder !== -1 && cartList.length > 1 && !!value) {
      const newCartList = [...cartList];
      newCartList[findOrder].order = +newCartList[findIndex].order;
      newCartList[findIndex].order = +value;
      setCartList(newCartList);
      return await postCartItem(newCartList);
    }

    if (findIndex !== -1 && !!value) {
      const newCartList = [...cartList];

      newCartList[findIndex].order = Number(value);
      setCartList(newCartList);

      return await postCartItem(newCartList);
    }
  };

  const onIncrease = async (id: string | number) => {
    try {
      setLoading(true);
      const findIndex = cartList?.findIndex(
        item => item?.productId.toString() === id.toString(),
      );
      if (findIndex !== -1) {
        const newCartList = [...cartList];

        newCartList[findIndex].amount += 5;

        const { cartList: cl, cartDetail } = await postCartItem(newCartList);
        await getSelectPromotion(cartDetail.allPromotions);
        setCartList(cl);
      }
    } catch (e) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  };
  const onDecrease = async (id: string | number) => {
    try {
      setLoading(true);
      const findIndex = cartList?.findIndex(
        item => item?.productId.toString() === id.toString(),
      );
      if (findIndex !== -1) {
        const newCartList = [...cartList];
        const amount = newCartList[findIndex].amount;
        if (amount > 5) {
          newCartList[findIndex].amount -= 5;
          const { cartList: cl, cartDetail } = await postCartItem(newCartList);
          await getSelectPromotion(cartDetail.allPromotions);

          setCartList(cl);
        } else {
          setIsDelCart(true);

          const currentCL = reArrangeShipment(
            newCartList.filter(el => el.productId !== id),
          );

          const { cartList: cl, cartDetail } = await postCartItem(currentCL);

          await getSelectPromotion(cartDetail.allPromotions);
          setCartList(cl);
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const onChangeText = async ({
    quantity,
    id,
  }: {
    quantity: string;
    id?: any;
  }) => {
    setLoading(true);
    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === id.toString(),
    );

    if (+quantity <= 0 && findIndex !== -1) {
      setVisibleDel(true);
      setDelId(id);
    }
    if (findIndex !== -1) {
      try {
        const newCartList = [...cartList];
        newCartList[findIndex].amount = Number(quantity);
        const { cartList: cl, cartDetail } = await postCartItem(newCartList);
        await getSelectPromotion(cartDetail.allPromotions);
        setCartList(cl);
      } catch (e) {
        console.log('error', e);
      } finally {
        setLoading(false);
      }
    }
  };
  const onDelete = async (id: string | number) => {
    try {
      setLoading(true);
      const newCartList = cartList?.filter(
        item => item?.productId.toString() !== id.toString(),
      );

      const currentCL = reArrangeShipment(newCartList);

      setVisibleDel(false);

      const { cartList: cl, cartDetail } = await postCartItem(currentCL);
      await getSelectPromotion(cartDetail.allPromotions);
      setCartList(cl);

      setIsDelCart(true);
    } catch (e) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  };
  const [isDelCart, setIsDelCart] = React.useState(false);
  const itemsDropdown = useMemo(() => {
    return cartList.map((el, idx) => {
      return {
        label: (idx + 1).toString(),
        value: (idx + 1).toString(),
      };
    });
  }, [cartList]);
  const RenderList = () => {
    return (
      <>
        {cartList.map(item => {
          const isUsePromotion = cartDetail?.allPromotions?.find(el => {
            const isFindPromotionId = item.orderProductPromotions.find(
              el2 =>
                el2.promotionId === el.promotionId &&
                el2.promotionType === 'DISCOUNT_NOT_MIX',
            );
            return el.isUse && !!isFindPromotionId;
          });
          const currentDiscount: any = item.orderProductPromotions.find(
            el =>
              el.promotionId === isUsePromotion?.promotionId &&
              el.promotionType === 'DISCOUNT_NOT_MIX',
          );

          const sumDiscount =
            isUsePromotion && currentDiscount
              ? currentDiscount?.conditionDetail.conditionDiscount
              : 0;
          return (
            <View
              key={item.productId}
              style={{
                marginTop: 16,
              }}>
              <View style={styles.containerItem}>
                <View style={styles.containerLeft}>
                  {item?.productImage ? (
                    <ImageCache
                      uri={getNewPath(item?.productImage)}
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
                    <Text
                      fontFamily="NotoSans"
                      fontSize={16}
                      bold
                      style={{
                        width: Dimensions.get('window').width - 150,
                      }}
                      numberOfLines={1}>
                      {item.productName}
                    </Text>
                    <Text fontFamily="NotoSans" fontSize={14} color="text3">
                      {item.packSize
                        ? `${item.packSize} | ฿${numberWithCommas(
                            +item.marketPrice,
                          )}/${item.saleUOMTH}`
                        : `฿${numberWithCommas(+item.marketPrice)}/${
                            item.saleUOMTH
                          }`}
                    </Text>
                    <Text fontSize={14} color="text2">
                      {`฿${numberWithCommas(+item.marketPrice)}/${
                        item.saleUOMTH
                      } x ${item.amount} ${item.saleUOMTH}`}
                      {sumDiscount > 0 && (
                        <Text color="current">
                          {`  ส่วนลด ฿${numberWithCommas(sumDiscount)}`}
                        </Text>
                      )}
                    </Text>
                    <Dropdown
                      style={{
                        width: 70,
                        height: 24,
                        justifyContent: 'center',
                        paddingLeft: 16,
                        marginTop: 8,
                        paddingVertical: 2,
                      }}
                      titleModal="เลือกลำดับ"
                      data={itemsDropdown}
                      value={item.order}
                      onChangeValue={value =>
                        onChangeOrder(value, item.productId)
                      }
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.buttonDel}
                  onPress={() => {
                    setDelId(item.productId);
                    setVisibleDel(true);
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
                    currentQuantity={+item.amount}
                    onChangeText={onChangeText}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    id={item.productId}
                  />
                </View>
                <View>
                  {sumDiscount > 0 && (
                    <Text
                      fontFamily="NotoSans"
                      color="text3"
                      style={{
                        textDecorationStyle: 'solid',
                        textDecorationLine:
                          sumDiscount > 0 ? 'line-through' : 'none',
                      }}>
                      {`฿${numberWithCommas(Number(item?.totalPrice || 0))}`}
                    </Text>
                  )}
                  <Text bold fontFamily="NotoSans">
                    {`฿${numberWithCommas(
                      sumDiscount > 0
                        ? Number(item?.totalPrice || 0) - sumDiscount
                        : item?.totalPrice,
                    )}`}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            <View>{RenderList()}</View>
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
        <ModalWarning
          visible={visibleDel}
          title="ยืนยันการลบสินค้า"
          desc="ต้องการยืนยันการลบสินค้าใช่หรือไม่ ?"
          onConfirm={() => onDelete(delId)}
          onRequestClose={() => setVisibleDel(false)}
        />

        {promotionList.length > 0 && (
          <PromotionSection promotionList={promotionList} />
        )}
        <GiftFromPromotion freebieListItem={freebieListItem} />
        <ModalMessage
          visible={isDelCart}
          message={t('modalMessage.deleteCart')}
          onRequestClose={() => setIsDelCart(false)}
        />
        <LoadingSpinner visible={loading} />
      </KeyboardAvoidingView>
    </>
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
