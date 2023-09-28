import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import Button from '../../components/Button/Button';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import Header from '../../components/Header/Header';
import InputText from '../../components/InputText/InputText';
import Text from '../../components/Text/Text';
import { useCart } from '../../contexts/CartContext';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { numberWithCommas } from '../../utils/functions';
import ListCollapse from './ListCollapse';
import ListSpecialRequest from './ListSpecialRequest';
import ListItemFreebies from './ListItemFreebies';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SpecialRequestScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SpecialRequestScreen'>) {
  const params = route.params;
  const [isShow, setIsShow] = React.useState(false);
  const [collapseObj, setCollapseObj] = React.useState<{
    discountList: boolean;
    specialRequestList: boolean;
  }>({
    discountList: true,
    specialRequestList: true,
  });

  const [specialRequestRemark, setSpecialRequestRemark] = React.useState('');
  const { cartList, cartDetail, promotionListValue } = useCart();
  useEffect(() => {
    getSpecialRequestRemark()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSpecialRequestRemark = async() => {
    const remark = await AsyncStorage.getItem('specialRequestRemark')
    setSpecialRequestRemark(remark||'')
    
  }

  const { dataObj } = useMemo(() => {
    const listDataDiscount: {
      label: string;
      valueLabel: string;
      value: string;
    }[] = [];
    const listDataDiscountSpecialRequest: {
      label: string;
      valueLabel: string;
      value: string;
    }[] = [];
    cartDetail.orderProducts
      .filter(el => !el.isFreebie)
      .map((item: any) => {
        const dataPush = {
          label: item.productName,
          valueLabel: `(฿${numberWithCommas(item.marketPrice)} x ${item.quantity
            } ${item.saleUOMTH ? item.saleUOMTH : item.saleUOM})`,
        };
        if (item.specialRequestDiscount > 0) {
          listDataDiscountSpecialRequest.push({
            ...dataPush,
            value: item.specialRequestDiscount,
          });
        }
        if (item?.orderProductPromotions?.length > 0) {
          item.orderProductPromotions.map((el: any) => {
            const isFind = promotionListValue.find(
              el2 => el2 === el.promotionId,
            );
            if (el.promotionType === 'DISCOUNT_NOT_MIX' || el.promotionType === 'DISCOUNT_MIX' && isFind) {
              listDataDiscount.push({
                ...dataPush,
                value: el.conditionDetail.conditionDiscount,
              });
            }
          });
        }
      });
    const dataObj = {
      priceBeforeDiscount: {
        label: 'ราคาก่อนลด',
        value: cartDetail.price,
      },
      discountList: {
        label: 'ส่วนลดจากรายการ',
        value: cartDetail.discount,
        listData: listDataDiscount,
      },
      discountSpecialRequest: {
        label: 'ส่วนลดพิเศษ (Special Req.)',
        value: cartDetail.specialRequestDiscount,
        listData: listDataDiscountSpecialRequest,
      },
      discountCo: {
        label: 'ส่วนลดดูราคา (CO. ดูแลราคา / วงเงินเคลม)',
        value: cartDetail.coDiscount,
      },
      discountCash: {
        label: 'ส่วนลดเงินสด',
        value: cartDetail.cashDiscount,
      },
      totalDiscount: {
        label: 'ส่วนลดรวม',
        value: cartDetail.totalDiscount,
      },
    };
    return {
      dataObj,
    };
  }, [cartDetail, promotionListValue]);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Header
          title="ขอส่วนลดพิเศษ"
          onBackCustom={() => {
            navigation.navigate('CartScreen', {
              specialRequestRemark: specialRequestRemark,
              step: 1,
            });
          }}
        />
        <Content
          noPadding
          style={{
            backgroundColor: colors.background1,
          }}>
          <ScrollView>
            <View style={styles.title}>
              <Text fontSize={18} fontFamily="NotoSans" bold>
                สินค้าที่ขอลดราคา
              </Text>
            </View>
            {cartList.map((item, index) => {
              return (
                <ListSpecialRequest
                  setIsShow={setIsShow}
                  item={item}
                  key={index}
                />
              );
            })}


            <View style={styles.commentCard}>
              <View>
                <Text semiBold color="text2" 
                fontFamily="NotoSans">ของแถม (Special Request)</Text>
              </View>




            <ListItemFreebies/>
            
              <Button
                onPress={() => navigation.navigate('FreeSpeciaRequestScreen')}
                secondary
                iconFont={
                  <Image
                    source={icons.iconAdd}
                    style={{
                      width: 26,
                      height: 26,
                    }}
                  />
                }
                title="กดเพื่อเพิ่มของแถม"
                style={{
                  marginTop: 16,
                  height: 40,
                  paddingVertical: 0,
                }}
              />
            </View>


            <View style={styles.commentCard}>
              <View>
                <Text semiBold color="text2" fontFamily="NotoSans">
                  หมายเหตุ (Special Request)
                </Text>

                <InputText
                  multiline
                  value={specialRequestRemark || ''}
                  placeholder="ใส่หมายเหตุ..."
                  numberOfLines={5}
                  scrollEnabled={false}
                  onChangeText={text => setSpecialRequestRemark(text)}
                  style={{
                    minHeight: Platform.OS === 'ios' ? 100 : 100,
                    textAlignVertical: 'top',
                    paddingTop: 10,
                  }}
                />
              </View>
            </View>
          </ScrollView>
          <FooterShadow
            style={{
              padding: 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsShow(!isShow);
              }}
              style={{
                paddingVertical: 8,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: colors.background2,
                borderBottomWidth: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text color="text3" fontSize={14} lineHeight={24}>
                  {isShow ? 'ย่อข้อมูล' : 'ดูทั้งหมด'}
                </Text>
                <Image
                  source={icons.iconDoubleDown}
                  style={{
                    width: 16,
                    height: 16,
                    transform: [{ rotate: isShow ? '0deg' : '189deg' }],
                  }}
                />
              </View>
            </TouchableOpacity>

            {isShow && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 16,
                    minHeight: 48,
                    marginBottom: 8,

                    paddingHorizontal: 16,
                  }}>
                  <Text color="text2">{dataObj.priceBeforeDiscount.label}</Text>
                  <Text color="text2">{`฿${numberWithCommas(
                    dataObj.priceBeforeDiscount.value,
                    true,
                  )}`}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setCollapseObj({
                      ...collapseObj,
                      discountList: !collapseObj.discountList,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 48,
                    paddingHorizontal: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text color="text2">{dataObj.discountList.label}</Text>
                    <Image
                      source={icons.iconCollapse}
                      style={
                        stylesIcon({ isCollapsed: collapseObj.discountList })
                          .icon
                      }
                    />
                  </View>
                  <Text semiBold color="current">{`-฿${numberWithCommas(
                    dataObj.discountList.value,
                    true,
                  )}`}</Text>
                </TouchableOpacity>
                {!collapseObj.discountList && (
                  <ListCollapse data={dataObj.discountList.listData} />
                )}
                <TouchableOpacity
                  onPress={() => {
                    setCollapseObj({
                      ...collapseObj,
                      specialRequestList: !collapseObj.specialRequestList,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 48,

                    paddingHorizontal: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text color="text2">
                      {dataObj.discountSpecialRequest.label}
                    </Text>
                    <Image
                      source={icons.iconCollapse}
                      style={
                        stylesIcon({
                          isCollapsed: collapseObj.specialRequestList,
                        }).icon
                      }
                    />
                  </View>
                  <Text color="specialRequest" semiBold>{`-฿${numberWithCommas(
                    dataObj.discountSpecialRequest.value,
                    true,
                  )}`}</Text>
                </TouchableOpacity>
                {!collapseObj.specialRequestList && (
                  <ListCollapse
                    data={dataObj.discountSpecialRequest.listData}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 48,

                    paddingHorizontal: 16,
                  }}>
                  <Text
                    color="text2"
                    style={{
                      flex: 0.7,
                    }}>
                    {dataObj.discountCash.label}
                  </Text>
                  <Text
                    style={{
                      flex: 0.3,
                    }}
                    right
                    semiBold
                    color="waiting">{`-฿${numberWithCommas(
                      dataObj.discountCash.value,
                      true,
                    )}`}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 48,

                    paddingHorizontal: 16,
                  }}>
                  <Text
                    color="text2"
                    style={{
                      flex: 0.7,
                    }}>
                    {dataObj.discountCo.label}
                  </Text>
                  <Text
                    style={{
                      flex: 0.3,
                    }}
                    semiBold
                    right
                    color="error">{`-฿${numberWithCommas(
                      dataObj.discountCo.value,
                      true,
                    )}`}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 48,
                    marginBottom: 8,
                    paddingHorizontal: 16,
                  }}>
                  <Text
                    color="text2"
                    style={{
                      flex: 0.7,
                    }}>
                    {dataObj.totalDiscount.label}
                  </Text>
                  <Text
                    style={{
                      flex: 0.3,
                    }}
                    right
                    semiBold>{`-฿${numberWithCommas(
                      dataObj.totalDiscount.value,
                      true,
                    )}`}</Text>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    width: Dimensions.get('window').width - 32,
                    borderBottomColor: colors.border1,
                    borderBottomWidth: 1,
                  }}
                />
              </>
            )}
            <View
              style={{
                paddingHorizontal: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 16,
                }}>
                <Text fontFamily="NotoSans" semiBold color="text2">
                  ราคารวม
                </Text>
                <Text
                  fontSize={24}
                  fontFamily="NotoSans"
                  color="primary"
                  bold>{`฿${numberWithCommas(
                    cartDetail.totalPrice,
                    true,
                  )}`}</Text>
              </View>
              <Button
                style={{
                  height: 50,
                  marginBottom: 16,
                }}
                onPress={async() => {
                 await AsyncStorage.setItem('specialRequestRemark',specialRequestRemark)
                  navigation.navigate('CartScreen', {
                    step: 1,
                    specialRequestRemark,
                  });
                }}
                title="บันทึกส่วนลดพิเศษ"
              />
            </View>
          </FooterShadow>
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
const styles = StyleSheet.create({
  title: {
    padding: 16,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
  commentCard: {
    padding: 16,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
});
const stylesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
      transform: [{ rotate: isCollapsed ? '0deg' : '180deg' }],
    },
  });
};
