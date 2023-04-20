import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import CartBadge from '../../components/CartBadge/CartBadge';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Body from './Body';
import Footer from './Footer';
import ModalMessage from '../../components/Modal/ModalMessage';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useFocusEffect } from '@react-navigation/native';
import { productServices } from '../../services/ProductServices';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { ProductSummary } from '../../entities/productType';
import { KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetailScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'ProductDetailScreen'>) {
  const { id } = route.params;
  const { t } = useLocalization();
  const [isAddCart, setIsAddCart] = React.useState(false);
  const [isDelCart, setIsDelCart] = React.useState(false);
  const [productItem, setProductItem] = React.useState<ProductSummary>();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getProductById = async () => {
        try {
          setLoading(true);
          const customerCompanyId = await AsyncStorage.getItem(
            'customerCompanyId',
          );
          const result = await productServices.getProductById(
            id,
            customerCompanyId || '',
          );

          setProductItem(result);
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      };
      getProductById();
    }, [id]),
  );
  console.log('productItem', JSON.stringify(productItem, null, 2));
  return (
    <Container>
      <Header componentRight={<CartBadge navigation={navigation} />} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, padding: 0, width: '100%' }}>
        <Content
          style={{
            backgroundColor: colors.background1,
            padding: 0,
          }}>
          <Body
            {...productItem}
            saleUOMTH={productItem?.saleUOMTH}
            packSize={productItem?.packSize}
            productImage={productItem?.productImage}
            productName={productItem?.productName}
            unitPrice={productItem?.unitPrice}
            commonName={productItem?.commonName}
          />
          {productItem && (
            <Footer
              navigation={navigation}
              id={id}
              setIsAddCart={setIsAddCart}
              setIsDelCart={setIsDelCart}
              setLoading={setLoading}
              productItem={productItem}
            />
          )}
        </Content>
      </KeyboardAvoidingView>
      <LoadingSpinner visible={loading} />
      <ModalMessage
        visible={isAddCart}
        message={t('modalMessage.addCart')}
        onRequestClose={() => setIsAddCart(false)}
      />
      <ModalMessage
        visible={isDelCart}
        message={t('modalMessage.deleteCart')}
        onRequestClose={() => setIsDelCart(false)}
      />
    </Container>
  );
}
