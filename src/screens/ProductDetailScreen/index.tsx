import React from 'react';
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
import images from '../../assets/images';

export default function ProductDetailScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'ProductDetailScreen'>) {
  const { id } = route.params;
  const { t } = useLocalization();
  const [isAddCart, setIsAddCart] = React.useState(false);
  const [isDelCart, setIsDelCart] = React.useState(false);
  const mockData = {
    name: 'ไฮซีส',
    price: 14000,
    unit: 'ลัง',
    detail: '40*500 cc',
    promotion: 100 * 1000,
    image: images.mockImage,
  };
  return (
    <Container>
      <Header componentRight={<CartBadge navigation={navigation} />} />
      <Content
        style={{
          backgroundColor: colors.background1,
          padding: 0,
        }}>
        <Body {...mockData} />
        <Footer
          navigation={navigation}
          id={id}
          setIsAddCart={setIsAddCart}
          setIsDelCart={setIsDelCart}
          {...mockData}
        />
      </Content>
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
