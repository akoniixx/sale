import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
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
  navigation,
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
  return (
    <>
      <View style={styles.row}>
        <Button
          onPress={() => setVisibleReject(true)}
          title="ปฎิเสธ"
          danger
          style={{
            width: '48%',
          }}
        />
        <Button
          onPress={() => setVisibleConfirm(true)}
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
            style={{
              minHeight: 100,
              marginVertical: 8,
              maxHeight: 100,
            }}
          />
        </View>
      </ModalCustomBody>
      <ModalWarning
        visible={visibleConfirm}
        title="ยืนยันอนุมัติคำสั่งซื้อ"
        desc="ต้องการยืนยันอนุมัติคำสั่งซื้อใช่หรือไม่?"
        onConfirm={onApproveOrder}
        onRequestClose={() => setVisibleConfirm(false)}
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
  },
  modalContent: {
    padding: 14,
    width: '100%',
  },
});
