import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';
import { navigationRef } from '../../navigations/RootNavigator';
import { useOrderLoads } from '../../contexts/OrdersLoadContext';
import DashedLine from 'react-native-dashed-line';
import { useAuth } from '../../contexts/AuthContext';
import { DataForOrderLoad } from '../../entities/orderLoadTypes';
// import SkeletonContent from 'react-native-skeleton-content';

const reArrangeShipment = (dataList: newProductType[]) => {
  return dataList.map((item, index) => {
    return {
      ...item,
      order: index + 1,
    };
  });
};
export default function ListItemInCart({
  loadingPromo,
}: {
  loadingPromo: boolean;
}) {
  const { t } = useLocalization();
  const [loading, setLoading] = React.useState(false);
  const [loadingAnotherPromotion, setLoadingAnotherPromotion] =
    React.useState(false);
    const [totalQuantities, setTotalQuantities] = useState<[{ unit: string, quantity: number }]>([{
      unit: '',
      quantity: 0
    }])
  const {
    cartList,
    cartDetail,
    setCartList,
    promotionList,
    freebieListItem,
    cartOrderLoad,
    cartApi: { postCartItem, getSelectPromotion },
  } = useCart();
  const {
    state: { user },
  } = useAuth();
  const {
    currentList,
    dataForLoad,
    setCurrentList,
    headData,
    setHeadData,
    dollyData,
    setDollyData,
    setDataForLoad,
    dataReadyLoad,
    setDataReadyLoad
  } = useOrderLoads();

  const [visibleDel, setVisibleDel] = React.useState(false);
  const [delId, setDelId] = React.useState<string | number>('');
  const [decreaseId, setDecreaseId] = React.useState<string | number>('');
  const [modalWarningDelete, setModalWarningDelete] = useState<boolean>(false)
  const [modalDelete, setModalDelete] = useState<boolean>(false)
  useEffect(() => {
    const quantitiesRecord: Record<string, number> = cartList.reduce((acc, product) => {
      const key = product.saleUOMTH || product.baseUnitOfMeaTh;
      if (key) {
        acc[key] = (acc[key] || 0) + product.quantity;
      }
      return acc;
    }, {});

    const totalQuantities = Object.entries(quantitiesRecord).map(([unit, quantity]) => ({ unit, quantity }));
    setTotalQuantities(totalQuantities)
  }, [cartList])

  useEffect(() => {
    const mergedProducts = dataForLoad.reduce((acc: { [key: string]: DataForOrderLoad }, item) => {
      const key = item.productId || `freebie_${item.productFreebiesId}` || 'undefined';
      if (acc[key]) {
        acc[key].quantity += item.quantity;
        if (item.isFreebie) {
          acc[key].freebieQuantity = (acc[key].freebieQuantity || 0) + item.quantity;
        }
      } else {
        acc[key] = { ...item };
        acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
      }
      return acc;
    }, {});

    const mergedProductsArray = Object.values(mergedProducts);


    const updatedData = cartOrderLoad.map((item1) => {

      const item2 = mergedProductsArray.find((item) => {
        if (item.productFreebiesId) {

          return item.productFreebiesId === item1.productFreebiesId
        } else {
          return item.productId === item1.productId
        }
      }
      );
      if (item2) {
        return {
          ...item1,
          quantity: item1.quantity - item2.quantity,
          isSelected: false,
          maxQuantity: item1.quantity,
          freebieQuantity: item2.freebieQuantity - item1.freebieQuantity,
          amount: item1.quantity - item1.freebieQuantity,
          amountFreebie: item1.freebieQuantity
        };
      }
      return {
        ...item1,
        quantity: item1.quantity,
        isSelected: false,
        maxQuantity: item1.quantity,
        freebieQuantity: item1.freebieQuantity,
        amount: item1.quantity - item1.freebieQuantity,
        amountFreebie: item1.freebieQuantity
      }
    });
    setCurrentList(updatedData);
  }, [cartOrderLoad, dataForLoad])
  


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

        newCartList[findIndex].amount += 1;
        const newDataReadyLoad = [...dataReadyLoad]
        const { cartList: cl, cartDetail: cD } = await postCartItem(
          newCartList,
          [],
          [],
          newDataReadyLoad

        );
        await getSelectPromotion(cD.allPromotions);
        setCartList(cl);
      }
    } catch (e) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  };

  const onDecrease = async (id: string) => {
    if (dataForLoad.length > 0) {
      setDecreaseId(id)
      setModalWarningDelete(true)
    } else {
      setLoading(true);

      const findIndex = cartList?.findIndex(
        item => item?.productId.toString() === id.toString(),
      );
      if (findIndex !== -1) {
        const newCartList = [...cartList];
        const amount = newCartList[findIndex].amount;
        if (amount > 1) {
          newCartList[findIndex].amount -= 1;
          const newDataReadyLoad = [...dataReadyLoad]
          const { cartList: cl, cartDetail: cD } = await postCartItem(
            newCartList,
            [],
            [],          
            newDataReadyLoad
          );
          await getSelectPromotion(cD.allPromotions);
          setCartList(newCartList);
        } else {
          newCartList.splice(findIndex, 1);
        
         
          const newDataReadyLoad = [...dataReadyLoad]
          const { cartList: cl, cartDetail: cD } = await postCartItem(
            newCartList,
            [],
            [],          
            newDataReadyLoad
          );
          await getSelectPromotion(cD.allPromotions);
          setCartList(newCartList);
        }
        setLoading(false);
      }
    }
  };

  const onConfirmDecrease = async () => {
    setModalWarningDelete(false)
    setLoading(true);

    const findIndex = cartList?.findIndex(
      item => item?.productId.toString() === decreaseId.toString(),
    );
    if (findIndex !== -1) {
      const newCartList = [...cartList];
      const amount = newCartList[findIndex].amount;
      if (amount > 1) {
      
        newCartList[findIndex].amount -= 1;
      
        const newDataReadyLoad = [...dataReadyLoad]
       

        const { cartList: cl, cartDetail: cD } = await postCartItem(
          newCartList,
          [],
          [],          
          newDataReadyLoad
        );
        await getSelectPromotion(cD.allPromotions);
        setCartList(newCartList);

      } else {
        newCartList.splice(findIndex, 1);
        setHeadData([])
        setDollyData([])
        setDataForLoad([])
        setDataReadyLoad([])
        const { cartList: cl, cartDetail: cD } = await postCartItem(
          newCartList,
        );
        await getSelectPromotion(cD.allPromotions);
        setCartList(newCartList);
      }
      setLoading(false);
    }

  }


 /*  const onDecrease = async (id: string | number) => {
    try {
      setLoading(true);
      const findIndex = cartList?.findIndex(
        item => item?.productId.toString() === id.toString(),
      );
      if (findIndex !== -1) {
        const newCartList = [...cartList];
        const amount = newCartList[findIndex].amount;
        if (amount > 5) {
          newCartList[findIndex].amount -= 1;
          const { cartList: cl, cartDetail: cD } = await postCartItem(
            newCartList,
          );
          await getSelectPromotion(cD.allPromotions);

          setCartList(cl);
        } else {
          setIsDelCart(true);

          const currentCL = reArrangeShipment(
            newCartList.filter(el => el.productId !== id),
          );
          const newDataReadyLoad = [...dataReadyLoad]
          const { cartList: cl, cartDetail: cD } = await postCartItem(
            currentCL,
            [],
            [],
            newDataReadyLoad
          );

          await getSelectPromotion(cD.allPromotions);
          setCartList(cl);
        }
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }; */
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
        const { cartList: cl, cartDetail: cD } = await postCartItem(
          newCartList,
        );
        await getSelectPromotion(cD.allPromotions);
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

      const { cartList: cl, cartDetail: cD } = await postCartItem(currentCL);
      await getSelectPromotion(cD.allPromotions);
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

  const RenderList = (load: boolean) => {
    return (
      <>
        {(cartList || []).map(item => {
          const isUsePromotion = cartDetail?.allPromotions?.find(el => {
            const isFindPromotionId = item?.orderProductPromotions.find(
              el2 =>
                el2.promotionId === el.promotionId &&
                (el2.promotionType === 'DISCOUNT_NOT_MIX' ||
                  el.promotionType === 'DISCOUNT_MIX'),
            );
            return el.isUse && !!isFindPromotionId;
          });

          const currentDiscount = item?.orderProductPromotions.find(el => {
            return (
              el.promotionId === isUsePromotion?.promotionId &&
              (el.promotionType === 'DISCOUNT_NOT_MIX' ||
                el.promotionType === 'DISCOUNT_MIX')
            );
          });
          let sumDiscount = 0;
          const isArray = Array.isArray(currentDiscount?.conditionDetail);
          if (!isArray && isUsePromotion && currentDiscount?.conditionDetail) {
            // why not the same type object?
            sumDiscount = currentDiscount?.conditionDetail?.conditionDiscount;
          }
          if (currentDiscount && isArray && isUsePromotion) {
            const findSumDiscount = (
              currentDiscount?.conditionDetail || []
            ).find(el => {
              const isHaveProducts = el?.products && el.products.length > 0;
              if (isHaveProducts) {
                return el.products.find(
                  el2 => el2.productId === item.productId,
                );
              }
              return el.conditionDiscount && el.productId === item.productId;
            });
            sumDiscount =
              (findSumDiscount && findSumDiscount?.conditionDiscount) || 0;
          }

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
                  <View style={styles.itemContent}>
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
                    <Text
                      fontSize={14}
                      color="text2"
                      style={{
                        alignSelf: 'flex-start',
                      }}>
                      {`฿${numberWithCommas(+item.marketPrice)}/${
                        item.saleUOMTH
                      } x ${item.amount} ${item.saleUOMTH}`}
                      {sumDiscount > 0 && !load ? (
                        <>
                          <Text color="current">
                            {`  ส่วนลด ฿${numberWithCommas(item.discount)}`}
                          </Text>
                        </>
                      ) : (
                        <View>
                          {sumDiscount > 0 && (
                            <SkeletonLoading
                              style={{
                                marginLeft: 8,
                                width: sumDiscount > 0 ? 100 : 50,
                              }}
                            />
                          )}
                        </View>
                      )}
                    </Text>
                    { user?.company == 'ICPL' &&<Dropdown
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
                    /> }
                    
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    alignItems: 'flex-end',
                  }}>
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
                    isSpecialRequest={false}
                    currentQuantity={+item.amount}
                    onChangeText={onChangeText}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    id={item.productId}
                  />
                </View>
                <View>
                  <Text
                    fontFamily="NotoSans"
                    color="text3"
                    style={{
                      textDecorationStyle: 'solid',
                      textDecorationLine:
                        sumDiscount > 0 ? 'line-through' : 'none',
                    }}>
                    {`฿${numberWithCommas(Number(item?.price || 0))}`}
                  </Text>

                  {sumDiscount > 0 && !load ? (
                    <>
                      <Text bold fontFamily="NotoSans">
                        {`฿${numberWithCommas(
                          sumDiscount > 0
                            ? Number(item?.totalPrice || 0)
                            : item?.totalPrice,
                        )}`}
                      </Text>
                    </>
                  ) : (
                    <>
                      {sumDiscount > 0 && (
                        <SkeletonLoading
                          style={{
                            width: item?.totalPrice
                              ? item?.totalPrice.toString().length * 12
                              : 0,
                          }}
                        />
                      )}
                    </>
                  )}
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
          <View>{RenderList(loadingAnotherPromotion || loading)}</View>
          <View style={{ marginTop: 10 }}>
          <DashedLine
            dashGap={0}
            dashThickness={0.5}
            dashColor={colors.border2}
            style={{ marginBottom: 20 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text fontFamily='NotoSans' color='text3' fontSize={16} bold>จำนวนรวม :    </Text>
            <View>
              {totalQuantities.map(i => (<Text fontFamily='NotoSans' fontSize={18} bold>
                {i.quantity%1===0? i.quantity : i.quantity.toFixed(2)} {i.unit}
              </Text>))}
            </View>
          </View>

        </View>
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
      <ModalWarning
        visible={visibleDel}
        title="ยืนยันการลบสินค้า"
        desc="ต้องการยืนยันการลบสินค้าใช่หรือไม่ ?"
        onConfirm={() => onDelete(delId)}
        onRequestClose={() => setVisibleDel(false)}
      />

      {promotionList.length > 0 && (
        <PromotionSection
          promotionList={promotionList}
          loadingPromo={loadingPromo || loading}
          loading={loadingAnotherPromotion}
          setLoading={setLoadingAnotherPromotion}
        />
      )}

<View style={{
          marginTop: 8,
          backgroundColor: 'white',
          padding: 16,
        }}>
          <Text fontSize={18} bold fontFamily="NotoSans">ลำดับการจัดเรียงสินค้า</Text>
          <TouchableOpacity onPress={() => navigationRef.navigate('OrderLoadsScreen')} style={{ paddingVertical: 15, paddingHorizontal: 10, borderWidth: 0.5, borderRadius: 8, marginTop: 10, borderColor: '#E1E7F6' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={icons.car} style={{ width: 24, height: 24, marginRight: 10 }} />
                <View>
                  <Text fontFamily='NotoSans' lineHeight={21} fontSize={14}>รายการจัดเรียงสินค้าขึ้นรถ</Text>
                  {!currentList.every(Item => Item.quantity === 0) && dataForLoad.length > 0 &&
                    <Text fontSize={14} lineHeight={18} color='secondary'>กรุณาตรวจสอบลำดับสินค้าอีกครั้ง</Text>
                  }
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {currentList.every(Item => Item.quantity === 0) && dataForLoad.length > 0 &&
                  <Image source={icons.uploadSucsess} style={{ width: 20, height: 20, marginRight: 10 }} />
                }
                {!currentList.every(Item => Item.quantity === 0) && dataForLoad.length > 0 &&
                  <Image source={icons.warning} style={{ width: 25, height: 25, marginRight: 10 }} />
                }
                <Image source={icons.iconNext} style={{ width: 20, height: 20 }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>


      <GiftFromPromotion
        freebieListItem={freebieListItem}
        loadingPromo={loadingPromo || loading || loadingAnotherPromotion}
      />
      <ModalMessage
        visible={isDelCart}
        message={t('modalMessage.deleteCart')}
        onRequestClose={() => setIsDelCart(false)}
      />
        <ModalWarning
          visible={modalWarningDelete}
          width={'70%'}
          title='ยืนยันการลดจำนวนสินค้าในตะกร้า'
          desc={`การลดสินค้าในตะกร้า ส่งผลต่อลำดับ\nการขนสินค้าขึ้นรถที่กำหนดไว้\nหากกดยืนยันการลดสินค้า`}
       
          onConfirm={onConfirmDecrease}
          onRequestClose={() => setModalWarningDelete(false)}
        />
      {/* <LoadingSpinner visible={loading} /> */}
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
    flex: 0.8,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
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
  itemContent: {
    alignSelf: 'flex-start',
  },
});
