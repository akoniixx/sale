import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Radio from '../../components/Radio/Radio';
import { numberWithCommas } from '../../utils/functions';
import Checkbox from '../../components/Checkbox/Checkbox';

import { useCart } from '../../contexts/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import SummaryList from '../../components/SummaryList/SummaryList';
import SummaryTotal from '../../components/SummaryList/SummaryTotal';
interface Props {
  setLoading: (value: boolean) => void;
}
export default function Summary({ setLoading }: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();

  const [termPayment, setTermPayment] = React.useState<string>('');

  const {
    cartDetail,
    promotionListValue,

    cartApi: { postEditIsUseCod, postEditPaymentMethod },
  } = useCart();
  useEffect(() => {
    const getTerm = async () => {
      const termPayment = await AsyncStorage.getItem('termPayment');
      if (termPayment) {
        setTermPayment(termPayment);
        const isCredit =
          termPayment && termPayment.toUpperCase().startsWith('N');
        if (isCredit) {
          await postEditPaymentMethod('CREDIT');
        }
      }
    };
    getTerm();
  }, []);
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
    cartDetail?.orderProducts
      ?.filter(el => !el.isFreebie)
      .map((item: any) => {
        const dataPush = {
          label: item.productName,
          valueLabel: `(฿${numberWithCommas(item.marketPrice)} x ${
            item.quantity
          } ${item.saleUOMTH ? item.saleUOMTH : item.saleUOM || 'Unit'})`,
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

            if (el.promotionType === 'DISCOUNT_NOT_MIX'||el.promotionType === 'DISCOUNT_MIX' && isFind) {
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

  const radioList = useMemo(() => {
    const isCredit = termPayment && termPayment.toUpperCase().startsWith('N');
    const list = [
      {
        title:
          user?.company === 'ICPF' ? 'เงินสด' : 'เงินสด (รับส่วนลดเพิ่ม 1.5%)',
        value: 'CASH',
        key: 'cash',
      },
      {
        title: 'เครดิต',
        value: 'CREDIT',
        key: 'credit',
      },
    ];
    if (isCredit) {
      const split = termPayment.toUpperCase().split('N');
      const numberDayCredit = Number(split[1]);
      list[1].title = `เครดิต (${numberDayCredit} วัน)`;
      return numberDayCredit > 0 ? list : list.slice(1);
    } else {
      return list.slice(0, 1);
    }
  }, [termPayment, user?.company]);

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
              value={cartDetail.paymentMethod}
              onChange={async value => {
                try {
                  setLoading(true);
                  await postEditPaymentMethod(value);
                  setLoading(false);
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoading(false);
                }
              }}
              radioLists={radioList}
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
                onPress={async () => {
                  try {
                    setLoading(true);
                    await postEditIsUseCod({
                      isUseCOD: !cartDetail.isUseCOD,
                    });
                    setLoading(false);
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                valueCheckbox={cartDetail.isUseCOD ? ['discount'] : []}
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
      <SummaryList dataObj={dataObj} />

      <SummaryTotal orderDetail={cartDetail} />
    </View>
  );
}

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
