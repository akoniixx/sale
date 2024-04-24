import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import {
  CartDetailType,
  newProductType,
  useCart,
} from '../../contexts/CartContext';
import StepTwo from './StepTwo';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import { StackScreenProps } from '@react-navigation/stack';
import {
  LocationDataType,
  MainStackParamList,
} from '../../navigations/MainNavigator';
import { useFocusEffect } from '@react-navigation/native';
import { orderServices } from '../../services/OrderServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { factoryServices } from '../../services/FactorySevices';
import ModalOnlyConfirm from '../../components/Modal/ModalOnlyConfirm';
import { useOrderLoads } from '../../contexts/OrdersLoadContext';
import { otherAddressServices } from '../../services/OtherAddressServices/OtherAddressServices';

export interface TypeDataStepTwo {
  specialRequestRemark?: string | null;
  saleCoRemark?: string | null;
  deliveryAddress?: string | null;
  deliveryAddressId?: string | null;
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
  const [modalReset, setModalReset] = useState<boolean>(false);
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
    setCartDetail,
    cartApi: { getCartList, getSelectPromotion, postCartItem },
  } = useCart();
  const {
    dataReadyLoad,
    setDataReadyLoad,
    setHeadData,
    setCurrentList,
    setDollyData,
    setDataForLoad,
    dataForLoad,
  } = useOrderLoads();
  const refInput = React.useRef<any>(null);
  const scrollRef = React.useRef<ScrollView | null>(null);
  const [modalReorder, setModalReorder] = useState(false);
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
    numberPlate: '',
  });
  const reArrangeShipment = (dataList: newProductType[]) => {
    return dataList.map((item, index) => {
      return {
        ...item,
        order: index + 1,
      };
    });
  };

  useEffect(() => {
    params?.isReorder && setModalReorder(true);
  }, []);

  const reArrangeReorder = async () => {
    const currentCL = reArrangeShipment(cartList);
    const { cartList: cl, cartDetail: cD } = await postCartItem(currentCL);
    await getSelectPromotion(cD.allPromotions);
    setCartList(cl);
    setModalReorder(false);
  };

  const reset = async () => {
    try {
      setLoading(true);
      setCartList([]);
      setModalReset(false);
      setCurrentStep(0);
      setDataReadyLoad([]);
      setHeadData([]);
      setDollyData([]);
      setDataForLoad([]);
      await AsyncStorage.removeItem('imageUris');
      await postCartItem([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateOrder = async () => {
    try {
      // const currentCompany = user?.company;
      /*  if (currentCompany !== 'ICPL' && !dataStepTwo.numberPlate) {
         setShowError(true);
         setVisibleConfirm(false);
         refInput?.current?.focus();
         if (scrollRef?.current) {
           scrollRef?.current?.scrollTo({ x: 0, y: 300, animated: true });
         }
         return;
       } */
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
        useCashDiscount: cartDetail.useCashDiscount,
        deliveryDest: dataStepTwo.deliveryDest,
        deliveryAddress: dataStepTwo.deliveryAddress,
        deliveryRemark: dataStepTwo.deliveryRemark || '',
        updateBy: `${user?.firstname} ${user?.lastname}`,
        orderProducts,
        allPromotions: cartDetail.allPromotions,
        specialRequestFreebies: cartDetail.specialRequestFreebies || [],
        orderLoads: dataReadyLoad,
      };

      if (dataStepTwo.deliveryAddressId) {
        payload.deliveryAddressId = dataStepTwo.deliveryAddressId;
        const result = await otherAddressServices.getById(
          dataStepTwo.deliveryAddressId,
        );
        if (result && result?.success) {
          const files = (result.responseData.fileOtherAddress || []).map(
            (el: { fileName: string }) => {
              return el.fileName;
            },
          );
          payload.deliveryFiles = files;
        }
      }
      if (dataStepTwo.specialRequestRemark) {
        payload.specialRequestRemark = dataStepTwo.specialRequestRemark;
      }
      if (dataStepTwo.saleCoRemark) {
        payload.saleCoRemark = dataStepTwo.saleCoRemark;
      }
      if (dataStepTwo.numberPlate) {
        payload.numberPlate = dataStepTwo.numberPlate;
      }
      const result = await orderServices.createOrder(payload);

      if (result) {
        setCartDetail({} as CartDetailType);
        setCartList([]);
        setFreebieListItem([]);
        setPromotionList([]);
        setPromotionListValue([]);
        setVisibleConfirm(false);
        setDataReadyLoad([]);
        setHeadData([]);
        setCurrentList([]);
        setDollyData([]);
        setDataForLoad([]);
        setLoading(false);
        await AsyncStorage.removeItem('specialRequestRemark');
        const storedUrisJson = await AsyncStorage.getItem('imageUris');
        if (storedUrisJson) {
          try {
            setLoading(true);
            let storedUris: object[] = storedUrisJson
              ? JSON.parse(storedUrisJson)
              : [];
            const data = new FormData();

            storedUris.forEach((e, index) => {
              data.append('files', {
                name: `image${index}.jpg`,
                type: e.type,
                uri: e.uri,
              });
            });

            data.append('orderId', result.orderId);
            data.append('updateBy', `${user?.firstname} ${user?.lastname}`);
            data.append('action', 'CREATE');

            const res = await orderServices.uploadFile(data);

            if (res) {
              setLoading(false);
              await AsyncStorage.removeItem('imageUris');
              setTimeout(() => {
                navigation.navigate('OrderSuccessScreen', {
                  orderId: result.orderId,
                });
              }, 800);
            }
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        } else {
          navigation.navigate('OrderSuccessScreen', {
            orderId: result.orderId,
          });
        }
      }
    } catch (e: any) {
      console.log(JSON.stringify(e.response.data, null, 2));
      setLoading(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const renderStep = () => {
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
  };
  useFocusEffect(
    React.useCallback(() => {
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

        if (params?.locationData) {
          // select location
          const isHaveLocationData = Object.keys(params.locationData).some(
            el => params.locationData?.[el as keyof LocationDataType],
          );
          const locationData = params.locationData ? params.locationData : null;
          if (!isHaveLocationData || !locationData) {
            return;
          }
          setAddressDelivery(prev => ({
            ...prev,
            address: locationData.address || '',
            name: locationData.name || '',
            id: locationData.id || '',
          }));
          setDataStepTwo(prev => ({
            ...prev,
            deliveryAddress: `${locationData.name || ''} ${
              locationData.address
            }`,
            deliveryRemark: locationData.comment || '',
            deliveryDest: locationData.selected || '',
            deliveryAddressId: locationData.id || undefined,
          }));
        } else if (user?.company && user?.company === 'ICPL') {
          getShopLocation();
        } else if (user?.company && user?.company === 'ICPF') {
          getFactory();
        } else {
          getShopLocation();
        }
        if (params?.step) {
          setCurrentStep(params.step);
        }
      };
      const getPromotion = async () => {
        await getCartList().then(async result => {
          if (result) {
            await getSelectPromotion(result.allPromotions);
          }
          return;
        });
      };
      const initData = async () => {
        setLoading(true);
        await Promise.all([getInitData(), getPromotion()]).finally(() => {
          setLoading(false);
        });
      };
      initData();
    }, [params?.step, user?.company, params?.locationData]),
  );
  // useEffect(() => {}, []);
  useEffect(() => {
    if (params?.specialRequestRemark) {
      setDataStepTwo(prev => ({
        ...prev,
        specialRequestRemark: params.specialRequestRemark,
      }));
    }
  }, [params?.specialRequestRemark]);

  return (
    <Container>
      <Header
        onBackCustom={() => {
          currentStep === 0
            ? navigation.goBack()
            : setCurrentStep(currentStep - 1);
        }}
        componentRight={
          <TouchableOpacity
            disabled={cartList.length <= 0}
            onPress={() => setModalReset(true)}>
            <Text
              fontSize={16}
              fontFamily="NotoSans"
              color={cartList.length <= 0 ? 'text3' : 'primary'}>
              ล้าง
            </Text>
          </TouchableOpacity>
        }
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
            labelList={['รายการคำสั่งซื้อ', 'สรุปคำสั่งซื้อ', 'สั่งซื้อสำเร็จ']}
          />
        </View>
        <ScrollView ref={ref => (scrollRef.current = ref)}>
          {renderStep()}
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
              if (
                dataStepTwo.numberPlate?.trim().length == 0 ||
                dataStepTwo.numberPlate == undefined
              ) {
                setShowError(true);
              } else {
                setVisibleConfirm(true);
              }
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
        desc="คุณต้องเพิ่มสินค้าที่ต้องการสั่งซื้อในตะกร้านี้"
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

      <ModalOnlyConfirm
        visible={modalReorder}
        title={`สินค้าในรายการ \nมีการเรียงลำดับการขนสินค้าใหม่ \nกรุณาตรวจสอบลำดับสินค้าอีกครั้ง \nก่อนสรุปคำสั่งซื้อ`}
        width={'80%'}
        onConfirm={async () => {
          await reArrangeReorder();
        }}
        textConfirm="ตกลง"
      />

      <ModalWarning
        visible={modalReset}
        width={'70%'}
        title="ยืนยันล้างตะกร้าสินค้า"
        desc={`ต้องการล้างรายการสินค้าในตะกร้าทั้งหมด\nใช่หรือไม่?`}
        onConfirm={() => reset()}
        minHeight={60}
        onRequestClose={() => setModalReset(false)}
        titleCenter
      />
    </Container>
  );
}
