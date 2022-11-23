import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';
import ListItemInCart from './ListItemInCart';
import Summary from './Summary';
import { useCart } from '../../contexts/CartContext';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';

export default function CartScreen() {
  const { t } = useLocalization();
  const { cartList } = useCart();

  return (
    <Container>
      <Header title={t('screens.CartScreen.title')} />
      <Content
        style={{
          backgroundColor: colors.background1,
          padding: 0,
        }}>
        <ScrollView>
          <ListItemInCart />
          <Summary />
          <View
            style={{
              height: 10,
            }}
          />
        </ScrollView>

        <View style={styles.containerFooter}>
          <TouchableOpacity
            style={styles.buttonFooter}
            onPress={() => {
              console.log('cartList', cartList);
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={styles.circle}>
                  <Text
                    fontSize={12}
                    lineHeight={12}
                    style={{}}
                    bold
                    color="primary">
                    {cartList.length}
                  </Text>
                </View>
                <Image
                  source={icons.cartFill}
                  style={{
                    width: 26,
                    height: 30,
                  }}
                />
              </View>
              <Text fontSize={18} bold fontFamily="NotoSans" color="white">
                {t('screens.CartScreen.summary.button')}
              </Text>
              <View />
            </View>
          </TouchableOpacity>
        </View>
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  containerFooter: {
    backgroundColor: colors.white,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 1.62,
    elevation: 14,
  },
  buttonFooter: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 48,
    borderRadius: 8,
  },
  circle: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: -6,
    borderColor: colors.primary,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 1,
    padding: 2,
    backgroundColor: colors.white,
  },
});
