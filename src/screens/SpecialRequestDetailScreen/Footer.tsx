import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import Button from '../../components/Button/Button';
import ModalWarning from '../../components/Modal/ModalWarning';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import ModalCustomBody from '../../components/Modal/ModalCustomBody';
import Text from '../../components/Text/Text';
import InputText from '../../components/InputText/InputText';
import { useSpecialRequest } from '../../contexts/SpecialRequestContext';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';
import { HistoryDataType } from '../../entities/historyTypes';
import ModalOnlyConfirm from '../../components/Modal/ModalOnlyConfirm';
import { REJECT_STATUS, WAIT_CONFIRM_STATUS } from '../../constant/statusOrder';

interface Props {
  orderId: string;
  refetch: () => void;
  navigation: StackScreenProps<
    MainStackParamList,
    'SpecialRequestDetailScreen'
  >['navigation'];
  orderDetail: HistoryDataType;
  scrollToTop: () => void;
}
export default function Footer({
  orderId,
  refetch,
  orderDetail,
  scrollToTop,
}: Props) {
  const { getSpecialRequestList } = useSpecialRequest();
  const {
    state: { user },
  } = useAuth();
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [visibleReject, setVisibleReject] = useState(false);
  const [alreadyReject, setAlreadyReject] = useState(false);
  const [alreadyRejectButConfirm, setAlreadyRejectButConfirm] = useState(false);
  const [alreadyConfirmButReject, setAlreadyConfirmButReject] = useState(false);
  const [showIsUpdate, setShowIsUpdate] = useState<boolean>(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const onApproveOrder = async () => {
    try {
      const payload = {
        orderId: orderId,
        status: 'WAIT_CONFIRM_ORDER',
        updateBy: `${user?.firstname} ${user?.lastname}`,
        navNo: orderDetail.navNo,
        soNo: orderDetail.soNo,
      };
      await orderServices.postStatusOrder(payload);

      refetch();
      getSpecialRequestList();
      setVisibleConfirm(false);
    } catch (error) {
      console.log('error', error);
    } finally {
      scrollToTop();
    }
  };
  const onRejectOrder = async () => {
    try {
      const payload = {
        orderId: orderId,
        status: 'REJECT_ORDER',
        updateBy: `${user?.firstname} ${user?.lastname}`,
        navNo: orderDetail.navNo,
        soNo: orderDetail.soNo,
        cancelRemark: rejectRemark,
      };
      await orderServices.postStatusOrder(payload);
      refetch();
      getSpecialRequestList();
      setVisibleReject(false);
    } catch (error) {
      console.log('error', error);
    } finally {
      scrollToTop();
    }
  };
  const onShowModalReject = async () => {
    try {
      const res = await orderServices.getOrderById(orderId);

      if (res) {
        const currentStatus = res?.status;
        if (REJECT_STATUS.includes(currentStatus)) {
          setAlreadyReject(true);
          return;
        }
        if (WAIT_CONFIRM_STATUS.includes(currentStatus)) {
          setAlreadyConfirmButReject(true);
          return;
        }
        switch (currentStatus) {
          case 'WAIT_APPROVE_ORDER':
            setVisibleReject(true);
            break;
          default: {
            setShowIsUpdate(true);
          }
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const onShowModalApprove = async () => {
    try {
      const res = await orderServices.getOrderById(orderId);
      if (res) {
        const currentStatus = res?.status;
        if (REJECT_STATUS.includes(currentStatus)) {
          setAlreadyReject(true);
          return;
        }
        switch (currentStatus) {
          case 'WAIT_APPROVE_ORDER':
            setVisibleConfirm(true);
            break;
          default: {
            setShowIsUpdate(true);
          }
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const { warningTitleAlreadyApproved } = useMemo(() => {
    if (orderDetail?.orderNo) {
      return {
        warningTitleAlreadyApproved: `คำสั่งซื้อ ${orderDetail?.orderNo} \n ได้รับการอนุมัติคำสั่งซื้อไปแล้ว \n จากผู้จัดการฝ่ายขาย`,
      };
    }
    return {
      warningTitleAlreadyApproved: '',
    };
  }, [orderDetail?.orderNo]);
  return (
    <>
      <View style={styles.row}>
        <Button
          onPress={() => {
            onShowModalReject();
          }}
          title="ปฎิเสธ"
          danger
          style={{
            width: '48%',
          }}
        />
        <Button
          onPress={onShowModalApprove}
          title="อนุมัติ"
          style={{
            width: '48%',
          }}
        />
      </View>
      <ModalCustomBody
        visible={visibleReject}
        disableConfirm={!rejectRemark}
        onConfirm={onRejectOrder}
        onRequestClose={() => {
          setRejectRemark('');
          setVisibleReject(false);
        }}>
        <View style={styles.modalContent}>
          <Text fontFamily="NotoSans" fontSize={16} semiBold>
            เหตุผลที่ปฎิเสธคำขอคำสั่งซื้อพิเศษ
          </Text>
          <InputText
            value={rejectRemark}
            onChangeText={text => {
              const startWithSpace = text.startsWith(' ');
              if (startWithSpace) {
                return;
              }
              setRejectRemark(text);
            }}
            placeholder="ระบุเหตุผลที่ยกเลิก"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            style={{
              minHeight: 100,
              marginVertical: 8,
              maxHeight: 100,
              textAlignVertical: 'top',
            }}
          />
        </View>
      </ModalCustomBody>
      <ModalWarning
        visible={visibleConfirm}
        title="ยืนยันอนุมัติคำสั่งซื้อ"
        desc="ต้องการยืนยันอนุมัติคำสั่งซื้อใช่หรือไม่?"
        onConfirm={onApproveOrder}
        onRequestClose={() => {
          setVisibleConfirm(false);
        }}
      />
      <ModalOnlyConfirm
        visible={showIsUpdate}
        width={Dimensions.get('window').width - 100}
        textConfirm="ดูรายละเอียด"
        title={`คำสั่งซื้อ ${orderDetail?.orderNo} \n คำสั่งซื้อนี้ ได้มีการเปลี่ยนแปลงข้อมูล กรุณาตรวจสอบอีกครั้ง`}
        onConfirm={() => {
          setShowIsUpdate(false);
          refetch && refetch();
          setTimeout(() => {
            scrollToTop();
          }, 500);
        }}
      />
      <ModalOnlyConfirm
        visible={alreadyReject}
        width={Dimensions.get('window').width - 100}
        textConfirm="ดูรายละเอียด"
        title={`คำสั่งซื้อ ${orderDetail?.orderNo} \n ไม่สามารถดำเนินการต่อได้ เนื่องจากคำสั่งซื้อนี้ ถูกยกเลิกหรือปฎิเสธไปแล้ว`}
        onConfirm={async () => {
          setAlreadyReject(false);
          await setTimeout(() => {
            refetch && refetch();
          }, 1000);
          scrollToTop();
        }}
      />

      <ModalOnlyConfirm
        visible={alreadyRejectButConfirm}
        width={Dimensions.get('window').width - 100}
        textConfirm="ดูรายละเอียด"
        title={`คำสั่งซื้อ ${orderDetail?.orderNo} \n ไม่สามารถอนุมัติได้ เนื่องจาก ผู้จัดการฝ่ายขายยื่นไม่อนุมัติคำสั่งซื้อ ในระบบไปก่อนหน้า`}
        onConfirm={async () => {
          setAlreadyRejectButConfirm(false);
          await setTimeout(() => {
            refetch && refetch();
          }, 800);
          scrollToTop();
        }}
      />

      <ModalWarning
        title={warningTitleAlreadyApproved}
        visible={alreadyConfirmButReject}
        descCenter
        descError
        titleFontSize={18}
        descFontSize={16}
        width={Dimensions.get('window').width - 100}
        desc={`ต้องการยืนยันการยกเลิกคำสั่งซื้อนี้\nใช่หรือไม่?`}
        onConfirm={() => {
          setAlreadyConfirmButReject(false);
          if (!orderDetail) {
            return;
          }
        }}
        onRequestClose={() => {
          setAlreadyConfirmButReject(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  modalContent: {
    padding: 14,
    width: '100%',
  },
});
