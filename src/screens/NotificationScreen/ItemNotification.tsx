import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import icons from '../../assets/icons';

interface Props {
  onPress?: () => void;
  isWarning?: boolean;
}
export default function ItemNotification({ onPress, isWarning = true }: Props) {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        <View
          style={{
            backgroundColor: isWarning ? colors.error : colors.white,
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: 10,
            marginTop: 10,
          }}
        />
        <View>
          <Text lineHeight={30} semiBold>
            คำสั่งซื้อ{' '}
            <Text lineHeight={30} color="primary" semiBold>
              SP020110023
            </Text>{' '}
            จากร้าน บริษัท
          </Text>
          <Text lineHeight={30} semiBold>
            บริษัท เอี่ยวฮั่วล้ง จำกัด
          </Text>
          <Text
            color="text3"
            fontSize={12}
            lineHeight={30}
            style={{
              marginTop: 5,
            }}>
            อยู่ในสถานะ{' '}
            <Text
              fontSize={12}
              lineHeight={30}
              style={{
                marginLeft: 5,
              }}
              color="primary">
              “{'ไม่อนุมัติคำสั่งซื้อ'}”
            </Text>
          </Text>
          <View style={styles.flexRow}>
            <Image
              style={{
                width: 13,
                height: 13,
                marginRight: 6,
              }}
              source={icons.package}
            />
            <Text color="text3" fontSize={12}>{`${2} รายการ`}</Text>
          </View>
          <Text lineHeight={30} color="text3" fontSize={12}>
            {dayjs().format('DD MMM BBBB HH:mm น.')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border1,
    width: '100%',

    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'white',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
