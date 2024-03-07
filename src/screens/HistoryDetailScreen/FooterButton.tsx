import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Button from '../../components/Button/Button';
import { HistoryDataType } from '../../entities/historyTypes';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ModalWarning from '../../components/Modal/ModalWarning';
import { orderServices } from '../../services/OrderServices';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  orderDetail: HistoryDataType | null;
  navigation: StackNavigationProp<
    MainStackParamList,
    'HistoryDetailScreen',
    undefined
  >;
}
export default function FooterButton({ orderDetail, navigation }: Props) {
  const {
    state: { user },
  } = useAuth();

  const onPressCancelOrder = async () => {
    if (!orderDetail) {
      return;
    }
    navigation.navigate('CancelOrderScreen', {
      orderId: orderDetail?.orderId,
      soNo: orderDetail?.soNo || null,
      navNo: orderDetail?.navNo || null,
      paidStatus: orderDetail?.paidStatus,
      orderNo: orderDetail?.orderNo,
      orderProducts: orderDetail?.orderProducts,
    });
  };
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
