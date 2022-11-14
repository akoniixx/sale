import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Radio from '../../components/Radio/Radio';
import { numberWithCommas } from '../../utils/functions';
import Checkbox from '../../components/Checkbox/Checkbox';

export default function Summary(): JSX.Element {
  const { t } = useLocalization();
  const [valueCheckbox, setValueCheckbox] = React.useState<string[]>([]);
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
              radioLists={[
                {
                  title: 'เงินสด (รับส่วนลดเพิ่ม 1.5%)',
                  value: 'cash',
                  key: 'cash',
                },
                {
                  title: 'เครดิต',
                  value: 'credit',
                  key: 'credit',
                },
              ]}
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
                  remainingMoney: numberWithCommas(2000 * 200),
                })}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <Checkbox
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
                    amount: 26600,
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
            277000,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity>
            <Text color="text2">
              {t('screens.CartScreen.summary.discountFromList')}
            </Text>
          </TouchableOpacity>
          <Text color="current" semiBold>{`-฿${numberWithCommas(
            277000,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity>
            <Text color="text2">
              {t('screens.CartScreen.summary.discountSpecial')}
            </Text>
          </TouchableOpacity>
          <Text color="specialRequest" semiBold>{`-฿${numberWithCommas(
            277000,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCarePrice')}
          </Text>
          <Text color="error" semiBold>{`-฿${numberWithCommas(
            277000,
            true,
          )}`}</Text>
        </View>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCash')}
          </Text>
          <Text color="waiting" semiBold>{`-฿${numberWithCommas(
            277000,
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
          <Text color="text2" semiBold>{`-฿${numberWithCommas(
            277000,
            true,
          )}`}</Text>
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
          fontSize={20}>{`฿${numberWithCommas(262995, true)}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  containerBottom: {
    padding: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
