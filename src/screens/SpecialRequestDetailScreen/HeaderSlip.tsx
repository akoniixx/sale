import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import BadgeStatus from '../../components/BadgeStatus/BadgeStatus';
import DashedLine from 'react-native-dashed-line';
import { colors } from '../../assets/colors/colors';
import dayjs from 'dayjs';
import icons from '../../assets/icons';
import { HistoryDataType } from '../../entities/historyTypes';

interface Props {
  orderDetail: HistoryDataType;
}
export default function HeaderSlip({ orderDetail }: Props) {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
          <Text bold fontFamily="NotoSans">
            {orderDetail?.orderNo}
          </Text>
        </View>
        <BadgeStatus status={orderDetail?.status || ''} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 24,
            marginRight: 8,
          }}
        />
        <Text fontSize={14} color="text3" fontFamily="NotoSans">
          ส่งคำสั่งซื้อ
        </Text>
      </View>
      <DashedLine
        dashColor={colors.border1}
        dashGap={6}
        dashLength={8}
        style={{
          marginVertical: 16,
        }}
      />
      <View
        style={{
          marginTop: 16,
        }}>
        <Text
          fontSize={14}
          color="text3"
          semiBold
          fontFamily="NotoSans"
          style={{
            marginBottom: 8,
          }}>
          ออเดอร์ของ
        </Text>
        <Text fontSize={18} semiBold fontFamily="NotoSans">
          {orderDetail?.customerName}
        </Text>
      </View>
      <View
        style={{
          marginTop: 16,
        }}>
        <Text
          fontSize={14}
          color="text3"
          semiBold
          fontFamily="NotoSans"
          style={{
            marginBottom: 8,
          }}>
          เขต
        </Text>
        <Text fontSize={18} semiBold fontFamily="NotoSans">
          {orderDetail?.customerZone}
        </Text>
      </View>
      <View
        style={{
          marginTop: 16,
        }}>
        <Text
          fontSize={14}
          color="text3"
          semiBold
          fontFamily="NotoSans"
          style={{
            marginBottom: 8,
          }}>
          เวลาที่เปิดออเดอร์
        </Text>
        <Text fontSize={18} semiBold fontFamily="NotoSans">
          {dayjs(orderDetail?.createAt).format('DD MMM BBBB , HH:mm น.')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 200,
    padding: 16,
  },
});
