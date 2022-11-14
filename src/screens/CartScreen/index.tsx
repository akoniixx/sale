import { View, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';
import ListItemInCart from './ListItemInCart';
import Summary from './Summary';
import Button from '../../components/Button/Button';

export default function CartScreen() {
  const { t } = useLocalization();

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
          <Button
            fontSize={18}
            title={t('screens.CartScreen.summary.button')}
          />
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
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});
