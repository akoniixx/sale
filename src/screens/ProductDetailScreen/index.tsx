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
import ModalWarning from '../../components/Modal/ModalWarning';

export default function ProductDetailScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'ProductDetailScreen'>) {
  const { id } = route.params;
  const { t } = useLocalization();
  const [isAddCart, setIsAddCart] = React.useState(false);
  const [isDelCart, setIsDelCart] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errorMessege, setErrorMessege] = React.useState<string>('');
  const [productItem, setProductItem] = React.useState<ProductSummary>();
  const [loading, setLoading] = useState(false);


const onError = () =>{
  setIsError(false)
  navigation.goBack()
}

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
  return (
    <>
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
              setIsError={setIsError}
              setErrorMessege={setErrorMessege}
              productItem={productItem}
            />
          )}
           <ModalWarning
     visible={isError}
     onlyCancel
     onRequestClose={() => onError()}
     textCancel={'ตกลง'}
     title={`${errorMessege?errorMessege:''}`}
     desc="กรุณาสร้างคำสั่งซื้อใหม่แยกประเภทสินค้า"
   />
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
    
   </>
  );
}
