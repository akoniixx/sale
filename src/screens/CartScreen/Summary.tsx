import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
  const [company, setCompany] = useState<string>('');
  const [idkey, setIdkey] = useState<string>('');

  const {
    cartDetail,
    promotionListValue,

    cartApi: { postEditIsUseCod, postEditPaymentMethod },
  } = useCart();
  useEffect(() => {
    const getTerm = async () => {
      const company = await AsyncStorage.getItem('company');
      setCompany(company || '');
      const termPayment = await AsyncStorage.getItem('termPayment');
      if (termPayment) {
        setTermPayment(termPayment);

        if (
          termPayment &&
          termPayment.toUpperCase().startsWith('N') &&
          termPayment != 'N0'
        ) {
          await postEditPaymentMethod('CREDIT', false);
          setIdkey('credit');
        } else if (termPayment && termPayment == 'N0') {
          await postEditPaymentMethod('CASH', false);
          setIdkey('credit');
        } else {
          await postEditPaymentMethod('CASH', company == 'ICPL');
          setIdkey('cash');
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

            if (
              (el.promotionType === 'DISCOUNT_NOT_MIX' ||
                el.promotionType === 'DISCOUNT_MIX') &&
              isFind
            ) {
              const isArray = Array.isArray(el.conditionDetail);

            
                listDataDiscount.push({
                  label: item.productName,
                  valueLabel: `(฿${numberWithCommas(el.discountPrice)} x ${
                    item.quantity
                  } ${item.saleUOMTH ? item.saleUOMTH : item.saleUOM || 'Unit'})`,
                  value: el?.totalDiscount,
                });
              
            }
          });
        }
      });
    const dataObj = {
      priceBeforeDiscount: {
        label: 'ราคาก่อนลด',
        value: cartDetail?.price,
      },
      discountList: {
        label: 'ส่วนลดจากรายการ',
        value: cartDetail?.discount,
        listData: listDataDiscount,
      },
      discountSpecialRequest: {
        label: 'ส่วนลดพิเศษ (Special Req.)',
        value: cartDetail?.specialRequestDiscount,
        listData: listDataDiscountSpecialRequest,
      },
      discountCo: {
        label: 'ส่วนลดดูราคา (CO. ดูแลราคา / วงเงินเคลม)',
        value: cartDetail?.coDiscount,
      },
      discountCash: {
        label: 'ส่วนลดเงินสด',
        value: cartDetail?.cashDiscount,
      },
      totalDiscount: {
        label: 'ส่วนลดรวม',
        value: cartDetail?.totalDiscount,
      },
      totalPriceNoVat: {
        label: 'มูลค่ารวมหลังหักส่วนลด',
        value: cartDetail?.totalPriceNoVat,
      },
      vat: {
        label: `ภาษีมูลค่าเพิ่ม ${cartDetail?.vatPercentage} %`,
        value: cartDetail?.vat,
      },
    };
    return {
      dataObj,
    };
  }, [cartDetail, promotionListValue]);

  const radioList = useMemo(() => {
    const isCredit =
      termPayment &&
      termPayment.toUpperCase().startsWith('N') &&
      termPayment !== 'N0';
    const isN0 = termPayment && termPayment === 'N0';
    const list = [
      {
        title: 'เงินสด ',
        value: {
          value: 'CASH',
          useCashDiscount: false,
          idKey: 'cash',
        },
        key: 'cash',
      },
      {
        title: 'เครดิต',
        value: {
          value: 'CREDIT',
          useCashDiscount: false,
          idKey: 'credit',
        },
        key: 'credit',
      },
    ];

    const listLadda = [
      {
        title: 'เงินสด (รับส่วนลดเพิ่ม 1.5%)',
        value: {
          value: 'CASH',
          useCashDiscount: true,
          idKey: 'cash',
        },
        key: 'cash',
      },
      {
        title: 'เครดิต ',
        value: {
          value: 'CREDIT',
          useCashDiscount: false,
          idKey: 'credit',
        },
        key: 'credit',
      },
    ];

    if (company === 'ICPL') {
      if (isCredit) {
        const split = termPayment.toUpperCase().split('N');
        const numberDayCredit = Number(split[1]);
        listLadda[1].title = `เครดิต (${numberDayCredit} วัน)`;
        return numberDayCredit > 0 ? listLadda : listLadda.slice(1);
      } else if (isN0) {
        const split = termPayment.toUpperCase().split('N');
        const numberDayCredit = Number(split[1]);
        listLadda[1].value.value = 'CASH';
        listLadda[1].title = `เครดิต (${numberDayCredit} วัน)`;
        return listLadda.slice(1);
      } else {
        listLadda[1].value.value = 'CASH';
        listLadda[1].title = `เครดิต (0 วัน)`;
        return listLadda;
      }
    } else {
      if (isCredit) {
        const split = termPayment.toUpperCase().split('N');
        const numberDayCredit = Number(split[1]);
        list[1].title = `เครดิต (${numberDayCredit} วัน)`;
        return list.slice(1);
      } else {
        return list.slice(0, 1);
      }
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
              value={cartDetail?.paymentMethod}
              idkey={idkey}
              onChange={async value => {
                try {
                  setLoading(true);
                  await postEditPaymentMethod(
                    value.value,
                    value.useCashDiscount,
                  );
                  setIdkey(value.idKey);
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
                    cartDetail?.creditMemoBalance,
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
                  cartDetail?.creditMemoBalance <= 0 ||
                  +cartDetail?.coAmount <= 0
                }
                onPress={async () => {
                  try {
                    setLoading(true);
                    await postEditIsUseCod({
                      isUseCOD: !cartDetail?.isUseCOD,
                    });
                    setLoading(false);
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                valueCheckbox={cartDetail?.isUseCOD ? ['discount'] : []}
                listCheckbox={[
                  {
                    title: 'ใช้ส่วนลด',
                    value: 'discount',
                    key: 'discount',
                    amount: cartDetail ? +cartDetail?.coAmount : 0,
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
