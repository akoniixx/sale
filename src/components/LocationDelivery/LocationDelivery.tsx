import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { HistoryDataType } from '../../entities/historyTypes';
import Text from '../Text/Text';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';

interface Props {
  orderDetail: HistoryDataType | null;
  navigation: any;
}
const locationMapping = {
  SHOP: 'จัดส่งที่ร้าน',
  FACTORY: 'รับที่โรงงาน',
  OTHER: 'จัดส่งที่อื่นๆ',
};
export default function LocationDelivery({ orderDetail, navigation }: Props) {
  const handlePress = () => {
    navigation.navigate('DeliveryFilesScreen', {
      deliveryFiles: orderDetail?.deliveryFiles,
    });
  };

  return (
    <View
      style={{
        marginTop: 8,
        paddingHorizontal: 16,
      }}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={icons.otherActive}
          resizeMode="contain"
        />
        <Text fontSize={14} color="text3" semiBold fontFamily="NotoSans">
          การจัดส่ง
        </Text>
      </View>

      <Text fontSize={18} semiBold fontFamily="NotoSans">
        {
          locationMapping[
            orderDetail?.deliveryDest as keyof typeof locationMapping
          ]
        }
      </Text>
      <Text
        style={{
          marginBottom: 8,
        }}>
        {orderDetail?.deliveryAddress || '-'}
      </Text>
      {orderDetail && orderDetail?.deliveryFiles?.length > 0 && (
        <TouchableOpacity
          onPress={handlePress}
          style={{
            borderWidth: 1,
            borderColor: colors.border1,
            padding: 15,
            borderRadius: 8,
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text fontFamily="NotoSans">
                เอกสารที่เกี่ยวกับการขนส่ง (
                {orderDetail?.deliveryFiles?.length || 0} รายการ)
              </Text>
            </View>
            <Image style={{ width: 24, height: 24 }} source={icons.iconNext} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
});
