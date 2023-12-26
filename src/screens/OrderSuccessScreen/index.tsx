import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  BackHandler,
} from 'react-native';
import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Header from '../../components/Header/Header';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Content from '../../components/Content/Content';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import DashedLine from 'react-native-dashed-line';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import Button from '../../components/Button/Button';
import { orderServices } from '../../services/OrderServices';
import { OrderDetailType } from '../../entities/orderTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCache from '../../components/ImageCache/ImageCache';
import { promotionTypeMap } from '../../utils/mappingObj';

const mappingStatusHeader = {
  WAIT_CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อ',
};
const mappingStatus = {
  WAIT_CONFIRM_ORDER: 'รอยืนยันคำสั่งซื้อจากร้านค้า',
};
export default function OrderSuccessScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'OrderSuccessScreen'>): JSX.Element {
  const { orderId } = route.params;
  const [freebieList, setFreebieList] = React.useState<
    {
      productName: string;
      id: string;
      quantity: number;
      baseUnit: string;
      status: string;
      productImage: string;
    }[]
  >([]);
  const [spfreebieList, setSpFreebieList] = React.useState<
    {
      productName: string;
      id: string;
      quantity: number;
      baseUnit: string;
      status: string;
      productImage: string;
    }[]
  >([]);
  const [orderData, setOrderData] = React.useState<
    OrderDetailType | undefined
  >();
  const [productBrand, setProductBrand] = React.useState<{
    product_brand_id: string;
    product_brand_name: string;
    company: string;
  } | null>(null);
  useEffect(() => {
    const getOrderByOrderId = async () => {
      try {
        const response = await orderServices.getOrderById(orderId);

        const productBrand = await AsyncStorage.getItem('productBrand');
        if (response) {

          const fbList: {
            productName: string;
            id: string;
            quantity: number;
            baseUnit: string;
            status: string;
            productImage: string;
          }[] = [];

          const spfbList: {
            productName: string;
            id: string;
            quantity: number;
            baseUnit: string;
            status: string;
            productImage: string;
          }[] = [];

          response.orderProducts
            .filter((el: any) => el.isFreebie)
            .map((fr: any) => {
              if (fr.isSpecialRequestFreebie === false) {
                if (fr.productFreebiesId) {
                  const newObj = {
                    productName: fr.productName,
                    id: fr.productFreebiesId,
                    quantity: fr.quantity,
                    baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn,
                    status: fr.productFreebiesStatus,
                    productImage: fr.productFreebiesImage,
                  };
                  fbList.push(newObj);
                } else {
                  const newObj = {
                    productName: fr.productName,
                    id: fr.productId,
                    quantity: fr.quantity,
                    baseUnit: fr.baseUnitOfMeaTh || fr.saleUOMTH || fr.saleUOM || '',
                    status: fr.productStatus,
                    productImage: fr.productImage,
                  };

                  fbList.push(newObj);
                }
              } else {
                const newObj = {
                  productName: fr.productName,
                  id: fr.productFreebiesId,
                  quantity: fr.quantity,
                  baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn || fr.saleUOMTH,
                  status: fr.productFreebiesStatus,
                  productImage: fr.productFreebiesImage || fr.productImage,
                };

                spfbList.push(newObj);
              }

            });
          setSpFreebieList(spfbList)
          setFreebieList(fbList);
          setOrderData(response);
        }
        setProductBrand(JSON.parse(productBrand || ''));
      } catch (e) {
        console.log(e);
      }
    };
    if (orderId) {
      getOrderByOrderId();
    }
  }, [orderId]);

  const getUniquePromotions = (orderProducts) => {
    const seenPromotions = new Set();
    
    // Use flatMap to flatten the promotions, and then filter based on unique values.
    return orderProducts.flatMap(el => 
      el.orderProductPromotions.filter(itm => {
        const key = `${itm.promotionType}-${itm.promotionName}`;
        if (!seenPromotions.has(key)) {
          seenPromotions.add(key);
          return true;
        }
        return false;
      })
    );
  };

  const listProduct = orderData?.orderProducts.map(el => {
    return {
      productName: el.productName,
      unit: el.saleUOMTH || el.saleUOM || '',
      totalPrice: el.totalPrice,
      quantity: el.quantity,
      isFreebie: el.isFreebie,
      price: el.price,
    };
  });

  useEffect(() => {
    console.log(orderData)
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Header
        style={{
          backgroundColor: colors.primary,
        }}
        titleColor="white"
        componentLeft={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('StoreDetailScreen', {
                productBrand: {
                  product_brand_id: productBrand?.product_brand_id || '',
                  product_brand_name: productBrand?.product_brand_name || '',
                  company: productBrand?.company || '',
                },
                name: orderData?.customerName || '',
              })
            }>
            <Image
              source={icons.iconCloseWhite}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        }
        title={
          orderData
            ? mappingStatusHeader[
            orderData.status as keyof typeof mappingStatusHeader
            ]
            : 'รอยืนยันคำสั่งซื้อ'
        }
      />
      <Content
        style={{
          backgroundColor: colors.primary,
          paddingTop: 0,
          flex: 1,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View style={styles().card}>
            {orderData ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 16,
                  }}>
                  <Text
                    color="primary"
                    bold
                    fontFamily="NotoSans"
                    fontSize={20}>
                    {orderData.customerName}
                  </Text>
                  <Image
                    source={images.timer}
                    style={{
                      width: 72,
                      height: 72,
                      marginTop: 16,
                    }}
                  />
                </View>
                <View
                  style={{
                    marginBottom: 16,
                  }}>
                  <Text center fontFamily="NotoSans" color="text3" semiBold>
                    {
                      mappingStatus[
                      orderData.status as keyof typeof mappingStatus
                      ]
                    }
                  </Text>
                </View>
                <DashedLine dashColor={colors.border1} dashGap={6} />
                <View
                  style={{
                    paddingVertical: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.invoice}
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 8,
                      }}
                    />
                    <Text bold fontFamily="NotoSans">
                      {orderData.orderNo}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 16,
                    }}>
                    <Text fontFamily="NotoSans" semiBold color="text2">
                      สินค้า
                    </Text>
                    <Text fontFamily="NotoSans" semiBold color="text2">
                      ราคารวม
                    </Text>
                  </View>
                  {(listProduct || []).map((el, idx) => {
                    if (el.isFreebie) {
                      return null;
                    }
                    return (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 16,
                        }}>
                        <Text
                          color="text2"
                          fontSize={14}
                          style={{
                            width: Dimensions.get('window').width / 2,
                          }}>
                          {el.productName} {`   ${el.quantity}x`}{' '}
                          {`(${el.unit})`}
                        </Text>
                        <View style={{ alignItems: 'flex-end' }}>
                          {el.price !== el.totalPrice ?
                            <Text
                              fontSize={12}
                              fontFamily="NotoSans"
                              color="text3"
                              style={{
                                textDecorationStyle: 'solid',
                                textDecorationLine: 'line-through',
                              }}>
                              {`฿${numberWithCommas(el.price, true)}`}
                            </Text>
                            : null}

                          <Text
                            fontFamily="NotoSans"
                            color="text2"
                            fontSize={14}
                            style={{
                              marginTop: 4,
                            }}>
                            {`฿${numberWithCommas(el.totalPrice, true)}`}
                          </Text>
                        </View>

                      </View>
                    );
                  })}
                </View>
                {orderData?.orderProducts[0].orderProductPromotions.length > 0 ?

                  (
                    <View style={{ marginVertical: 10 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={icons.promoDetail} style={{ width: 24, height: 24, marginRight: 8 }} />
                        <Text fontSize={16} lineHeight={24} bold fontFamily='NotoSans' color='text3'>รายละเอียดโปรโมชัน</Text>
                      </View>

                      <View style={{ borderWidth: 0.5, padding: 20, backgroundColor: '#F8FAFF', borderColor: '#EAEAEA', marginVertical: 10 }}>
                      {
  getUniquePromotions(orderData?.orderProducts || []).map(promo => (
    <Text fontFamily="Sarabun">
      {`• ${promotionTypeMap(promo.promotionType)} - ${promo.promotionName}`}
    </Text>
  ))
}
                      </View>
                    </View>
                  ) : null
                }


                <DashedLine dashColor={colors.border1} dashGap={6} />
                {orderData.vat!==0&&<>
                  <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 50,
                    alignItems: 'center',
                  }}>
        <Text color="text2" semiBold>
        มูลค่ารวมหลังหักส่วนลด
        </Text>
        <Text color="text2" semiBold fontFamily="NotoSans" fontSize={20}>
          {`฿${numberWithCommas(+orderData?.price-orderData?.totalDiscount, true)}`}
        </Text>
      </View>
      <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 50,
                    alignItems: 'center',
                  }}>
        <Text color="text2" semiBold>
          {`ภาษีมูลค่าเพิ่ม ${orderData.vatPercentage} %`}
        </Text>
        <Text color="text2" semiBold fontFamily="NotoSans" fontSize={20}>
          {`฿${numberWithCommas(+orderData.vat, true)}`}
        </Text>
      </View>
      <DashedLine dashColor={colors.border1} dashGap={6} />
                </>}
              
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 60,
                    alignItems: 'center',
                  }}>
                  <Text fontFamily="NotoSans" semiBold color="text2">
                    ราคารวม
                  </Text>
                  <Text
                    fontSize={24}
                    fontFamily="NotoSans"
                    bold
                    color="primary">
                    {`฿${numberWithCommas(orderData.totalPrice, true)}`}
                  </Text>
                </View>
               
                <DashedLine dashColor={colors.border1} dashGap={6} />
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 60,
                      alignItems: 'center',
                    }}>
                    <Text fontFamily="NotoSans" bold fontSize={18}>
                      ของแถมที่ได้รับ
                    </Text>
                    <Text fontSize={14} bold color="text3" lineHeight={24}>
                      {`ทั้งหมด ${freebieList.length} รายการ`}
                    </Text>
                  </View>
                  {freebieList.length > 0 ? (
                    <>
                      {freebieList.map((el, idx) => {
                        return (
                          <View
                            key={idx}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 16,
                            }}>
                            {el.productImage ? (
                              <ImageCache
                                uri={getNewPath(el.productImage)}
                                style={{
                                  width: 56,
                                  height: 56,
                                }}
                              />
                            ) : (
                              <Image
                                source={images.emptyProduct}
                                style={{
                                  width: 56,
                                  height: 56,
                                }}
                              />
                            )}
                            <View
                              style={{
                                marginLeft: 8,
                              }}>
                              <Text
                                fontSize={14}
                                color="text3"
                                lineHeight={24}
                                style={{
                                  width: Dimensions.get('window').width / 2,
                                }}>
                                {el.productName}
                              </Text>
                              <Text fontSize={14}>
                                {el.quantity} {el.baseUnit}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={images.emptyGift}
                        style={{
                          width: 140,
                          height: 140,
                        }}
                      />
                      <Text color="text3" center fontFamily="NotoSans">
                        ไม่มีของแถมที่ได้รับ
                      </Text>
                    </View>
                  )}

                </View>

                <View>

                  {spfreebieList.length > 0 ? (

                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          height: 60,
                          marginVertical: 20
                        }}>
                        <View>
                          <Text fontFamily="NotoSans" bold fontSize={18}>
                            ของแถมที่ได้รับ
                          </Text>
                          <Text fontFamily="NotoSans" bold fontSize={18}>
                            (Special Request)
                          </Text>
                        </View>

                        <Text fontSize={14} bold color="text3" lineHeight={24}>
                          {`ทั้งหมด ${spfreebieList.length} รายการ`}
                        </Text>
                      </View>
                      {spfreebieList.map((el, idx) => {
                        return (
                          <View
                            key={idx}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 16,
                            }}>
                            {el.productImage ? (
                              <ImageCache
                                uri={getNewPath(el.productImage)}
                                style={{
                                  width: 56,
                                  height: 56,
                                }}
                              />
                            ) : (
                              <Image
                                source={images.emptyProduct}
                                style={{
                                  width: 56,
                                  height: 56,
                                }}
                              />
                            )}
                            <View
                              style={{
                                marginLeft: 8,
                              }}>
                              <Text
                                fontSize={14}
                                color="text3"
                                lineHeight={24}
                                style={{
                                  width: Dimensions.get('window').width / 2,
                                }}>
                                {el.productName}
                              </Text>
                              <Text fontSize={14}>
                                {el.quantity} {el.baseUnit}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </>
                  ) : null}

                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16,
                  }}>
                  <TouchableOpacity
                    style={{ height: 40 }}
                    onPress={() => {
                      navigation.navigate('HistoryDetailScreen', {
                        orderId: orderData.orderId,
                        headerTitle: 'รายละเอียดคำสั่งซื้อ',
                      });
                    }}>
                    <Text color="primary" fontSize={14} lineHeight={24}>
                      ดูรายละเอียดคำสั่งซื้อนี้
                    </Text>
                  </TouchableOpacity>
                  <Button
                    title="ดูคำสั่งซื้อทั้งหมด"
                    onPress={() => {
                      navigation.navigate('MainScreen', {
                        screen: 'history',
                      });
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                }}
              />
            )}
          </View>
          <Image
            style={{
              width: '100%',
              height: 32,
            }}
            source={images.bottomSlip}
          />
        </ScrollView>
      </Content>
    </SafeAreaView>
  );
}
const styles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flex: 1,
    },
  });
};
