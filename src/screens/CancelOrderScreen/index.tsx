import {
  View,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import ImageCache from '../../components/ImageCache/ImageCache';
import images from '../../assets/images';

import InputText from '../../components/InputText/InputText';
import ModalWarning from '../../components/Modal/ModalWarning';
import Button from '../../components/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import { orderServices } from '../../services/OrderServices';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { numberWithCommas } from '../../utils/functions';

interface PayloadCancelOrder {
  orderId: string;
  status: string;
  paidStatus: string;
  cancelRemark: string;
  soNo: string | null;
  navNo: string | null;
  updateBy: string;
}
export default function CancelOrderScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'CancelOrderScreen'>) {
  const {
    state: { user },
  } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { orderNo, orderProducts, orderId, paidStatus, soNo, navNo, status } =
    route.params;
  const noFreebies = orderProducts.filter(item => item.isFreebie === false);
  const [reason, setReason] = React.useState<string>('');
  const [modalConfirm, setModalConfirm] = React.useState<boolean>(false);
  const onCancelOrder = async () => {
    try {
      setLoading(true);
      const isStatusWaitApprove = status === 'WAIT_APPROVE_ORDER';
      const payload: PayloadCancelOrder = {
        orderId,
        cancelRemark: reason,
        status: isStatusWaitApprove
          ? 'SALE_CANCEL_ORDER'
          : 'COMPANY_CANCEL_ORDER',
        paidStatus,
        soNo,
        navNo,
        updateBy: `${user?.firstname} ${user?.lastname}`,
      };

      /*  console.log(JSON.stringify(payload)) */
      const res = await orderServices.postStatusOrder(payload);
      if (res) {
        setModalConfirm(false);
        setLoading(false);

        navigation.navigate('CancelOrderSuccessScreen', {
          ...res,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
      }}>
      <Container edges={['top', 'left', 'right', 'bottom']}>
        <Header title="คำขอยกเลิกคำสั่งซื้อ" />
        <Content
          noPadding
          style={{
            backgroundColor: colors.background1,
          }}>
          <ScrollView>
            <View
              style={{
                height: 50,
                paddingHorizontal: 16,
                justifyContent: 'center',

                backgroundColor: colors.background1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.invoice}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 8,
                  }}
                />
                <Text bold fontFamily="NotoSans" color="text2">
                  {orderNo}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.white,
                paddingBottom: 16,
              }}>
              <Text
                fontSize={16}
                color="text2"
                semiBold
                fontFamily="NotoSans"
                style={{
                  marginVertical: 8,
                }}>
                สินค้าที่ยกเลิก
              </Text>

              {noFreebies.map((el, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 32,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      {el.productImage ? (
                        <ImageCache
                          uri={el.productImage}
                          style={{
                            width: 72,
                            height: 72,
                          }}
                        />
                      ) : (
                        <Image
                          source={images.emptyProduct}
                          style={{
                            width: 72,
                            height: 72,
                          }}
                        />
                      )}
                      <View
                        style={{
                          marginLeft: 16,
                        }}>
                        <Text semiBold>{el.productName}</Text>
                        <View
                          style={{
                            marginTop: 4,
                          }}>
                          <Text color="text3">
                            {numberWithCommas(el.quantity)}
                            {`  (${el.saleUOMTH || el.saleUOM})`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            <View
              style={{
                marginTop: 16,
                padding: 16,
                backgroundColor: colors.white,
              }}>
              <Text semiBold color="text2" fontFamily="NotoSans">
                เหตุผลที่ยกเลิก
              </Text>
              <InputText
                scrollEnabled={false}
                multiline
                value={reason || ''}
                placeholder="ใส่เหตุผล..."
                numberOfLines={5}
                onChangeText={text => setReason(text)}
                style={{
                  minHeight: Platform.OS === 'ios' ? 100 : 100,
                  textAlignVertical: 'top',
                  paddingTop: 10,
                }}
              />
            </View>
            <View
              style={{
                height: 40,
                backgroundColor: colors.background1,
              }}
            />
          </ScrollView>
        </Content>
        <View style={styles.container}>
          <Button
            disabled={reason.length < 1}
            style={{
              marginBottom: 16,
            }}
            title="ยกเลิกคำสั่งซื้อ"
            onPress={() => {
              setModalConfirm(true);
            }}
          />
        </View>

        <ModalWarning
          title="ยืนยันคำขอยกเลิกคำสั่งซื้อ ใช่หรือไม่"
          visible={modalConfirm}
          minHeight={50}
          width={250}
          onConfirm={() => {
            onCancelOrder();
          }}
          onRequestClose={() => {
            setModalConfirm(false);
          }}
        />
      </Container>
      <LoadingSpinner visible={loading} />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
