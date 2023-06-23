import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
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
import { orderServices } from '../../services/OrderServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { factoryServices } from '../../services/FactorySevices';

export interface TypeDataStepTwo {
  specialRequestRemark?: string | null;
  saleCoRemark?: string | null;
  deliveryAddress?: string | null;
  deliveryRemark?: string | null;
  deliveryDest: string;
  numberPlate?: string | null;
}
export default function CartScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'CartScreen'>): JSX.Element {
  const { t } = useLocalization();
  const params = route.params;
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showError, setShowError] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const {
    state: { user },
  } = useAuth();
  const [visibleConfirm, setVisibleConfirm] = React.useState(false);
  const {
    cartList,
    setFreebieListItem,
    setPromotionList,
    setPromotionListValue,
    setCartList,
    cartDetail,
    cartApi: { getCartList, getSelectPromotion },
  } = useCart();
  const refInput = React.useRef<any>(null);
  const scrollRef = React.useRef<ScrollView | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [addressDelivery, setAddressDelivery] = React.useState({
    address: '',
    name: '',
  });
  const [dataStepTwo, setDataStepTwo] = React.useState<TypeDataStepTwo>({
    specialRequestRemark: null,
    saleCoRemark: null,
    deliveryAddress: null,
    deliveryRemark: null,
    deliveryDest: '',
    numberPlate: null,
  });

  const onCreateOrder = async () => {
    try {
      const currentCompany = user?.company;
      if (currentCompany !== 'ICPL' && !dataStepTwo.numberPlate) {
        setShowError(true);
        setVisibleConfirm(false);
        refInput?.current?.focus();
        if (scrollRef?.current) {
          scrollRef?.current?.scrollTo({ x: 0, y: 300, animated: true });
        }
        return;
      }
      setLoading(true);
      setVisibleConfirm(false);
      const customerNo = await AsyncStorage.getItem('customerNo');
      const customerName = await AsyncStorage.getItem('customerName');
      const userShopId = await AsyncStorage.getItem('userShopId');

      const orderProducts = (cartList || []).map(item => {
        return {
          specialRequest: item.specialRequest,
          productId: +item.productId,
          quantity: item.amount,
          shipmentOrder: item.order,
        };
      });

      const payload: any = {
        company: cartDetail.company,
        userShopId: userShopId ? userShopId : null,

        userStaffId: cartDetail.userStaffId,
        customerCompanyId: cartDetail.customerCompanyId,
        customerName: customerName || '',
        customerNo: customerNo || '',
        isUseCOD: cartDetail.isUseCOD,
        paymentMethod: cartDetail.paymentMethod,
        sellerName: `${user?.firstname} ${user?.lastname}`,
        customerZone: user?.zone,

        deliveryDest: dataStepTwo.deliveryDest,
        deliveryAddress: dataStepTwo.deliveryAddress,
        deliveryRemark: dataStepTwo.deliveryRemark || '',
        updateBy: `${user?.firstname} ${user?.lastname}`,
        orderProducts,
        allPromotions: cartDetail.allPromotions,
      };
      if (dataStepTwo.specialRequestRemark) {
        payload.specialRequestRemark = dataStepTwo.specialRequestRemark;
      }
      if (dataStepTwo.saleCoRemark) {
        payload.saleCoRemark = dataStepTwo.saleCoRemark;
      }
      if (dataStepTwo.numberPlate) {
        payload.numberPlate = dataStepTwo.numberPlate;
      }
      // console.log('payload', JSON.stringify(payload, null, 2));
      const result = await orderServices.createOrder(payload);
      if (result) {
        // console.log('result', JSON.stringify(result, null, 2));

        setCartList([]);
        setFreebieListItem([]);
        setPromotionList([]);
        setPromotionListValue([]);
        setVisibleConfirm(false);
        setLoading(false);
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
          <StepTwo
            isShowError={showError}
            setIsShowError={setShowError}
            setLoading={setLoading}
            loading={loading}
            setDataStepTwo={setDataStepTwo}
            dataStepTwo={dataStepTwo}
            navigation={navigation}
            refInput={refInput}
            addressDelivery={addressDelivery}
            setAddressDelivery={setAddressDelivery}
          />
        );
      }
      default: {
        return <StepOne loading={loading} />;
      }
    }
  }, [
    currentStep,
    dataStepTwo,
    addressDelivery,
    navigation,
    loading,
    showError,
    setShowError,
  ]);
  useFocusEffect(
    React.useCallback(() => {
      const getPromotion = async () => {
        setLoading(true);
        await Promise.all([
          getSelectPromotion(cartDetail?.allPromotions || []),
          getCartList(),
        ]).finally(() => {
          if (cartDetail?.orderProducts?.length > 0) {
            const freebieListItem = cartDetail?.orderProducts
              .filter(el => el?.isFreebie)
              .map(el => {
                if (el.productFreebiesId) {
                  const newObj = {
                    productName: el.productName,
                    id: el.productFreebiesId,
                    quantity: el.quantity,
                    baseUnit: el.baseUnitOfMeaTh || el.baseUnitOfMeaEn,
                    status: el.productFreebiesStatus,
                    productImage: el.productFreebiesImage,
                  };
                  return newObj;
                } else {
                  const newObj = {
                    productName: el.productName,
                    id: el.productId,
                    quantity: el.quantity,
                    baseUnit: el.saleUOMTH || el.saleUOM || '',
                    status: el.productStatus,
                    productImage: el.productImage,
                  };
                  return newObj;
                }
              });
            setFreebieListItem(freebieListItem);
          }
          setLoading(false);
        });
      };
      getPromotion();
      const getInitData = async () => {
        const getFactory = async () => {
          const factoryData = await factoryServices.getFactory(
            user?.company || '',
          );
          setAddressDelivery(prev => ({
            ...prev,
            name: factoryData.name,
            address: `${factoryData.address} ${factoryData.subDistrict} ${factoryData.district} ${factoryData.province} ${factoryData.postcode}`,
          }));
          setDataStepTwo(prev => ({
            ...prev,
            deliveryDest: 'FACTORY',
            deliveryAddress: `${factoryData.address} ${factoryData.subDistrict} ${factoryData.district} ${factoryData.province} ${factoryData.postcode}`,
          }));
        };
        const getShopLocation = async () => {
          const address = await AsyncStorage.getItem('address');
          const parsedAddress = JSON.parse(address || '');
          setAddressDelivery({
            address: parsedAddress.addressText,
            name: parsedAddress.name,
          });
          setDataStepTwo(prev => ({
            ...prev,
            deliveryAddress: `${parsedAddress.name} ${parsedAddress.addressText}`,
            deliveryDest: 'SHOP',
          }));
        };
        if (user?.company && user?.company === 'ICPL') {
          getShopLocation();
        }
        if (user?.company && user?.company === 'ICPF') {
          getFactory();
        }

        if (params?.step) {
          setCurrentStep(params.step);
        }
      };
      getInitData();
    }, []),
  );
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    if (params?.specialRequestRemark) {
      setDataStepTwo(prev => ({
        ...prev,
        specialRequestRemark: params.specialRequestRemark,
      }));
    }
  }, [params?.specialRequestRemark]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        height: '100%',
      }}>
      <Container>
        <Header
          onBackCustom={() => {
            currentStep === 0
              ? navigation.goBack()
              : setCurrentStep(currentStep - 1);
          }}
          title={t('screens.CartScreen.title')}
        />
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
                if (cartList.length > 0) {
                  setCurrentStep(step === 2 ? currentStep : step);
                }
              }}
              currentStep={currentStep}
              labelList={[
                'รายการคำสั่งซื้อ',
                'สรุปคำสั่งซื้อ',
                'สั่งซื้อสำเร็จ',
              ]}
            />
          </View>
          <ScrollView ref={ref => (scrollRef.current = ref)}>
            {renderStep}
          </ScrollView>
        </Content>
        <FooterShadow
          style={{
            paddingBottom: isKeyboardVisible ? 0 : 16,
          }}>
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
    </KeyboardAvoidingView>
  );
}
