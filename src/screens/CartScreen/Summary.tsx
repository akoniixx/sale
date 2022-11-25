import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Radio from '../../components/Radio/Radio';
import { numberWithCommas } from '../../utils/functions';
import Checkbox from '../../components/Checkbox/Checkbox';
import icons from '../../assets/icons';
import { useCart } from '../../contexts/CartContext';

export default function Summary(): JSX.Element {
  const { t } = useLocalization();
  const [valueCheckbox, setValueCheckbox] = React.useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = React.useState<{
    [key: string]: boolean;
  }>({
    discountList: true,
    specialListDiscount: true,
  });
  const { cartList } = useCart();
  const totalPrice = cartList.reduce((a, b) => a + b.amount * +b.unitPrice, 0);

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
            fontFamily="NotoSans">{`-฿${numberWithCommas(10000, true)}`}</Text>
        </View>
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
            fontFamily="NotoSans">{`-฿${numberWithCommas(0, true)}`}</Text>
        </View>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCarePrice')}
          </Text>
          <Text
            color="error"
            semiBold
            fontFamily="NotoSans">{`-฿${numberWithCommas(5, true)}`}</Text>
        </View>
        <View style={styles.row}>
          <Text color="text2">
            {t('screens.CartScreen.summary.discountCash')}
          </Text>
          <Text
            color="waiting"
            fontFamily="NotoSans"
            semiBold>{`-฿${numberWithCommas(3591, true)}`}</Text>
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
            {`-฿${numberWithCommas(14000, true)}`}
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
          fontSize={20}>{`฿${numberWithCommas(totalPrice, true)}`}</Text>
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
  },
  containerBottom: {
    padding: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
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
