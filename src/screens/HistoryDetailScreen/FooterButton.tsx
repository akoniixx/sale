import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useMemo } from 'react';
import Button from '../../components/Button/Button';
import { HistoryDataType } from '../../entities/historyTypes';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ModalWarning from '../../components/Modal/ModalWarning';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';
import ModalOnlyConfirm from '../../components/Modal/ModalOnlyConfirm';
import {
  OPEN_STATUS,
  REJECT_STATUS,
  WAIT_CONFIRM_STATUS,
} from '../../constant/statusOrder';

interface Props {
  orderDetail: HistoryDataType | null;
  navigation: StackNavigationProp<
    MainStackParamList,
    'HistoryDetailScreen',
    undefined
  >;
  refetch?: () => void;
  scrollToTop: () => void;
}
const mappingTitle = {
  COMPANY_CANCEL_ORDER: `ไม่สามารถยกเลิกได้ เนื่องจาก\nบริษัทได้ทำการยกเลิกคำสั่งซื้อไปแล้ว\nในระบบไปก่อนหน้า`,
  SALE_CANCEL_ORDER: `ไม่สามารถยกเลิกได้ เนื่องจาก\n พนักงานขายอื่นได้ทำการยกเลิกคำสั่งซื้อไปแล้ว\nในระบบไปก่อนหน้า`,
  SHOPAPP_CANCEL_ORDER: `ไม่สามารถยกเลิกได้ เนื่องจาก\nร้านค้าได้ทำการยกเลิกคำสั่งซื้อไปแล้ว\nในระบบไปก่อนหน้า`,
  REJECT_ORDER: `ไม่สามารถยกเลิกได้ เนื่องจาก\n ผู้จัดการฝ่ายขายยื่นไม่อนุมัติคำสั่งซื้อ\nในระบบไปก่อนหน้า`,
};

export default function FooterButton({
  orderDetail,
  navigation,
  refetch,
  scrollToTop,
}: Props) {
  const {
    state: { user },
  } = useAuth();
  const [showAlreadyReject, setShowAlreadyReject] = React.useState<
    string | undefined
  >('');
  const [showAlreadyConfirm, setShowAlreadyConfirm] =
    React.useState<boolean>(false);
  const [currentS, setCurrentS] = React.useState<string | undefined>('');
  const [showIsUpdate, setShowIsUpdate] = React.useState<boolean>(false);
  const onPressCancelOrder = async () => {
    if (!orderDetail) {
      return;
    }
    const result: HistoryDataType | undefined =
      await orderServices.getOrderById(orderDetail?.orderId);

    if (result) {
      const currentStatus = result?.status;
      if (REJECT_STATUS.includes(currentStatus)) {
        setShowAlreadyReject(
          mappingTitle[currentStatus as keyof typeof mappingTitle],
        );
        return;
      }
      if (OPEN_STATUS.includes(currentStatus)) {
        setShowIsUpdate(true);
        return;
      }
      if (
        WAIT_CONFIRM_STATUS.includes(currentStatus) &&
        orderDetail?.hasSpecialRequest
      ) {
        setShowAlreadyConfirm(true);
        setCurrentS(currentStatus);
        return;
      }

      navigation.navigate('CancelOrderScreen', {
        orderId: orderDetail?.orderId,
        soNo: orderDetail?.soNo || null,
        navNo: orderDetail?.navNo || null,
        paidStatus: orderDetail?.paidStatus,
        orderNo: orderDetail?.orderNo,
        orderProducts: orderDetail?.orderProducts,
        status: currentStatus as
          | 'WAIT_APPROVE_ORDER'
          | 'WAIT_CONFIRM_ORDER'
          | 'CONFIRM_ORDER',
      });
    } else {
      return;
    }
  };
  const { warningTitle } = useMemo(() => {
    if (orderDetail?.orderNo) {
      return {
        warningTitle: `คำสั่งซื้อ ${orderDetail?.orderNo} \n ได้รับการอนุมัติคำสั่งซื้อไปแล้ว \n จากผู้จัดการฝ่ายขาย`,
      };
    }
    return {
      warningTitle: '',
    };
  }, [orderDetail?.orderNo]);

  if (user?.role === 'SALE MANAGER') {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <Button
          danger
          title="ยกเลิกคำสั่งซื้อ"
          onPress={() => {
            onPressCancelOrder();
          }}
        />
      </View>
      <ModalWarning
        title={warningTitle}
        visible={showAlreadyConfirm}
        descCenter
        descError
        titleFontSize={18}
        descFontSize={16}
        width={Dimensions.get('window').width - 124}
        desc={`ต้องการยืนยันการยกเลิกคำสั่งซื้อนี้\nใช่หรือไม่?`}
        onConfirm={() => {
          setShowAlreadyConfirm(false);
          if (!orderDetail || !currentS) {
            return;
          }
          navigation.navigate('CancelOrderScreen', {
            orderId: orderDetail?.orderId,
            soNo: orderDetail?.soNo || null,
            navNo: orderDetail?.navNo || null,
            paidStatus: orderDetail?.paidStatus,
            orderNo: orderDetail?.orderNo,
            orderProducts: orderDetail?.orderProducts,
            status: currentS as
              | 'WAIT_APPROVE_ORDER'
              | 'WAIT_CONFIRM_ORDER'
              | 'CONFIRM_ORDER',
          });
        }}
        onRequestClose={() => {
          setShowAlreadyConfirm(false);
        }}
      />
      <ModalOnlyConfirm
        visible={!!showAlreadyReject}
        width={Dimensions.get('window').width - 124}
        textConfirm="ดูรายละเอียด"
        title={`คำสั่งซื้อ ${orderDetail?.orderNo} \n ${showAlreadyReject}`}
        onConfirm={async () => {
          setShowAlreadyReject(undefined);
          await setTimeout(() => {
            refetch && refetch();
          }, 1000);
          scrollToTop();
        }}
      />
      <ModalOnlyConfirm
        visible={showIsUpdate}
        width={Dimensions.get('window').width - 124}
        textConfirm="ดูรายละเอียด"
        title={`คำสั่งซื้อ ${orderDetail?.orderNo} \n คำสั่งซื้อนี้ ได้มีการเปลี่ยนแปลงข้อมูล กรุณาตรวจสอบอีกครั้ง`}
        onConfirm={async () => {
          setShowIsUpdate(false);
          await setTimeout(() => {
            refetch && refetch();
          }, 1000);
          scrollToTop();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
