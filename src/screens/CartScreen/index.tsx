import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';

import Step from '../../components/Step/Step';
import Button from '../../components/Button/Button';
import StepOne from './StepOne';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import ModalWarning from '../../components/Modal/ModalWarning';
import { useCart } from '../../contexts/CartContext';
import StepTwo from './StepTwo';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { useFocusEffect } from '@react-navigation/native';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { orderServices } from '../../services/OrderServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TypeDataStepTwo {
  paymentMethod: string;
  specialRequestRemark?: string | null;
  saleCoRemark?: string | null;
}
export default function CartScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'CartScreen'>): JSX.Element {
  const { t } = useLocalization();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [visibleConfirm, setVisibleConfirm] = React.useState(false);
  const {
    cartList,
    setCartList,
    cartApi: { getCartList },
  } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [dataStepTwo, setDataStepTwo] = React.useState<TypeDataStepTwo>({
    paymentMethod: '',
    specialRequestRemark: null,
    saleCoRemark: null,
  });
  const onCreateOrder = async () => {
    try {
      const customerNo = await AsyncStorage.getItem('customerNo');
      const customerName = await AsyncStorage.getItem('customerName');
      setLoading(true);
      const orderProducts = (cartList || []).map(item => {
        return {
          productId: +item.productId,
          quantity: item.amount,
          shipmentOrder: item.order,
        };
      });

      const data = await getCartList();
      console.log(data);

      const payload: any = {
        company: data.company,
        customerCompanyId: data.customerCompanyId,
        userStaffId: data.userStaffId,
        orderProducts,
        paymentMethod: dataStepTwo.paymentMethod,
        customerNo: customerNo || '',
        customerName: customerName || '',
      };
      if (dataStepTwo.specialRequestRemark) {
        payload.specialRequestRemark = dataStepTwo.specialRequestRemark;
      }
      if (dataStepTwo.saleCoRemark) {
        payload.saleCoRemark = dataStepTwo.saleCoRemark;
      }
      const result = await orderServices.createOrder(payload);
      if (result) {
        setCartList([]);
        setVisibleConfirm(false);
        navigation.navigate('OrderSuccessScreen', {
          orderId: result.orderId,
        });
      }
    } catch (e: any) {
      console.log(JSON.stringify(e.response.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 1: {
        return (
          <StepTwo setDataStepTwo={setDataStepTwo} dataStepTwo={dataStepTwo} />
        );
      }
      default: {
        return <StepOne />;
      }
    }
  }, [currentStep, dataStepTwo]);
  useFocusEffect(
    React.useCallback(() => {
      getCartList();
    }, [getCartList]),
  );

  return (
    <Container>
      <Header title={t('screens.CartScreen.title')} />
      <Content
        style={{
          backgroundColor: colors.background1,
          padding: 0,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: 12,
            justifyContent: 'center',
            marginVertical: 8,
          }}>
          <Step
            onPress={step => {
              setCurrentStep(step === 2 ? currentStep : step);
            }}
            currentStep={currentStep}
            labelList={['รายการคำสั่งซื้อ', 'สรุปคำสั่งซื้อ', 'สั่งซื้อสำเร็จ']}
          />
        </View>
        <ScrollView>{renderStep}</ScrollView>
      </Content>
      <FooterShadow>
        {currentStep === 0 && (
          <Button
            onPress={() => {
              if (cartList.length < 1) {
                return setVisible(true);
              }
              setCurrentStep(prev => prev + 1);
            }}
            title={t('screens.CartScreen.stepOneButton')}
          />
        )}
        {currentStep === 1 && (
          <TouchableOpacity
            onPress={() => {
              setVisibleConfirm(true);
            }}
            style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}>
            <View
              style={{
                position: 'absolute',
                left: 16,
              }}>
              <Image
                source={icons.cartFill}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <View
                style={{
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
                }}>
                <Text color="primary" fontSize={12} lineHeight={12}>
                  {cartList.length}
                </Text>
              </View>
            </View>
            <Text color="white" bold fontSize={18} fontFamily="NotoSans">
              {t('screens.CartScreen.stepTwoButton')}
            </Text>
          </TouchableOpacity>
        )}
      </FooterShadow>
      <LoadingSpinner visible={loading} />
      <ModalWarning
        visible={visible}
        onlyCancel
        onRequestClose={() => setVisible(false)}
        textCancel={'ตกลง'}
        title="ไม่สามารถสั่งสินค้าได้"
        desc="คุณต้องเพิ่มสินค้าที่ต้องการสั่งซื้อในตระกร้านี้"
      />
      <ModalWarning
        visible={visibleConfirm}
        title="ยืนยันคำสั่งซื้อ"
        desc="ต้องการยืนยันคำสั่งซื้อใช่หรือไม่?"
        onConfirm={async () => {
          await onCreateOrder();
        }}
        onRequestClose={() => setVisibleConfirm(false)}
      />
    </Container>
  );
}
