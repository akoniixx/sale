import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Radio from '../../components/Radio/Radio';
import { numberWithCommas } from '../../utils/functions';
import Checkbox from '../../components/Checkbox/Checkbox';
import icons from '../../assets/icons';
import { useCart } from '../../contexts/CartContext';
import { TypeDataStepTwo } from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
interface Props {
  setDataStepTwo: React.Dispatch<React.SetStateAction<TypeDataStepTwo>>;
  dataStepTwo: TypeDataStepTwo;
}
export default function Summary({
  setDataStepTwo,
  dataStepTwo,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();
  const [valueCheckbox, setValueCheckbox] = React.useState<string[]>([]);
  const [termPayment, setTermPayment] = React.useState<string>('');
  const [isCollapsed, setIsCollapsed] = React.useState<{
    [key: string]: boolean;
  }>({
    discountList: true,
    specialListDiscount: true,
  });

  useEffect(() => {
    const getTerm = async () => {
      const termPayment = await AsyncStorage.getItem('termPayment');
      if (termPayment) {
        setTermPayment(termPayment);
        setDataStepTwo({
          ...dataStepTwo,
          paymentMethod: 'CASH',
        });
      }
    };
    getTerm();
  }, []);
  const { cartDetail, promotionListValue } = useCart();

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
          valueLabel: `(฿${numberWithCommas(item.marketPrice)} x ${
            item.quantity
          } ${item.saleUomTH ? item.saleUomTH : item.saleUom})`,
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
            if (el.promotionType === 'DISCOUNT_NOT_MIX' && isFind) {
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
  }, [cartDetail]);

  const renderDiscountList = () => {
    return dataObj.discountList.listData?.map((el, idx) => {
      return (
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.background1,
              minHeight: 52,
              marginBottom: 0,
            },
          ]}
          key={idx}>
          <Text fontSize={14} color="text3">
            {el.label + ' ' + el.valueLabel}
          </Text>
          <Text fontSize={14} color="text3">
            {`-฿${numberWithCommas(el.value)}`}
          </Text>
        </View>
      );
    });
  };

  const renderSpecialRequest = () => {
    return dataObj.discountSpecialRequest.listData?.map((el, idx) => {
      return (
        <View
          style={[
            styles.row,
            {
              backgroundColor: colors.background1,
              minHeight: 52,
              marginBottom: 0,
            },
          ]}
          key={idx}>
          <Text fontSize={14} color="text3">
            {el.label + ' ' + el.valueLabel}
          </Text>
          <Text fontSize={14} color="text3">
            {`-฿${numberWithCommas(el.value)}`}
          </Text>
        </View>
      );
    });
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 0,
          margin: -2,
          marginBottom: 0,
          borderStyle: 'dashed',
          borderColor: '#D1D2DE',
          paddingBottom: 8,
          paddingHorizontal: 16,
        }}>
        <View>
          <View
            style={{
              padding: 16,

              borderBottomColor: colors.border1,
              borderBottomWidth: 1,
            }}>
            <Text fontFamily="NotoSans" bold fontSize={18}>
              {t('screens.CartScreen.summary.titlePayment')}
            </Text>
          </View>
          <View
            style={{
              padding: 16,
              borderBottomColor: colors.border1,
              borderBottomWidth: 1,
            }}>
            <Radio
              value={dataStepTwo.paymentMethod}
              onChange={value => {
                setDataStepTwo(prev => ({
                  ...prev,
                  paymentMethod: value,
                }));
              }}
              radioLists={[
                {
                  title:
                    user?.company === 'ICPF'
                      ? 'เงินสด'
                      : 'เงินสด (รับส่วนลดเพิ่ม 1.5%)',
                  value: 'CASH',
                  key: 'cash',
                },
                {
                  title: 'เครดิต',
                  value: 'CREDIT',
                  key: 'credit',
                },
              ].slice(0, termPayment.toUpperCase().startsWith('N') ? 2 : 1)}
            />
          </View>
          <View
            style={{
              padding: 16,
              paddingBottom: 0,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text fontFamily="NotoSans" bold fontSize={18}>
                {t('screens.CartScreen.summary.titlePromotion')}
              </Text>
              <Text color="text3" fontSize={14}>
                {t('screens.CartScreen.summary.remainingMoney', {
                  remainingMoney: numberWithCommas(
                    cartDetail.creditMemoBalance,
                  ),
                })}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <Checkbox
                disabled={
                  cartDetail.creditMemoBalance <= 0 ||
                  +cartDetail?.coAmount <= 0
                }
                onPress={v => {
                  const haveValue = valueCheckbox.includes(v);
                  if (haveValue) {
                    setValueCheckbox(valueCheckbox.filter(item => item !== v));
                  } else {
                    setValueCheckbox([...valueCheckbox, v]);
                  }
                }}
                valueCheckbox={valueCheckbox}
                listCheckbox={[
                  {
                    title: 'ใช้ส่วนลด',
                    value: 'discount',
                    key: 'discount',
                    amount: cartDetail ? +cartDetail.coAmount : 0,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.containerBottom}>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.priceBeforeDiscount')}
          </Text>
          <Text color="text2" semiBold>{`฿${numberWithCommas(
            dataObj.priceBeforeDiscount.value,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setIsCollapsed({
                ...isCollapsed,
                discountList: !isCollapsed.discountList,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text color="text2">
              {t('screens.CartScreen.summary.discountFromList')}
            </Text>
            <Image
              source={icons.iconCollapse}
              style={stylesIcon({ isCollapsed: isCollapsed.discountList }).icon}
            />
          </TouchableOpacity>

          <Text
            color="current"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(
            dataObj.discountList.value,
            true,
          )}`}</Text>
        </View>
        {!isCollapsed.discountList && <>{renderDiscountList()}</>}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setIsCollapsed({
                ...isCollapsed,
                specialListDiscount: !isCollapsed.specialListDiscount,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text color="text2">
              {t('screens.CartScreen.summary.discountSpecial')}
            </Text>
            <Image
              source={icons.iconCollapse}
              style={
                stylesIcon({ isCollapsed: isCollapsed.specialListDiscount })
                  .icon
              }
            />
          </TouchableOpacity>
          <Text
            color="specialRequest"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(
            dataObj.discountSpecialRequest.value,
            true,
          )}`}</Text>
        </View>
        {!isCollapsed.specialListDiscount && <>{renderSpecialRequest()}</>}

        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCarePrice')}
          </Text>
          <Text
            color="error"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(
            dataObj.discountCo.value,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCash')}
          </Text>
          <Text
            color="waiting"
            fontFamily="NotoSans"
            semiBold>{`-฿${numberWithCommas(
            dataObj.discountCash.value,
            true,
          )}`}</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              marginBottom: 4,
            },
          ]}>
          <Text color="text2">
            {t('screens.CartScreen.summary.totalDiscount')}
          </Text>
          <Text color="text2" semiBold fontFamily="NotoSans">
            {`-฿${numberWithCommas(dataObj.totalDiscount.value, true)}`}
          </Text>
        </View>
      </View>
      <View style={styles.summary}>
        <Text color="text2" semiBold fontFamily="NotoSans">
          {t('screens.CartScreen.summary.totalPrice')}
        </Text>
        <Text
          fontFamily="NotoSans"
          color="primary"
          bold
          fontSize={20}>{`฿${numberWithCommas(
          cartDetail.totalPrice,
          true,
        )}`}</Text>
      </View>
    </View>
  );
}
const stylesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
      transform: [{ rotate: isCollapsed ? '0deg' : '180deg' }],
    },
  });
};
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: 10,
  },
  containerBottom: {
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 42,

    paddingHorizontal: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopColor: colors.border1,
    borderTopWidth: 1,
  },
});
