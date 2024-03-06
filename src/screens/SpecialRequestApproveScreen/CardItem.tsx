import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import dayjs from 'dayjs';
import icons from '../../assets/icons';
import BadgeStatus from '../../components/BadgeStatus/BadgeStatus';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import { SpecialRequestType } from '../../contexts/SpecialRequestContext';
import images from '../../assets/images';
import ImageCache from '../../components/ImageCache/ImageCache';

interface Props {
  [key: string]: any;
  navigation: any;
  item: SpecialRequestType;
}
export default function CardItem({ navigation, item, ...props }: Props) {
  const onPress = () => {
    navigation.navigate('SpecialRequestDetailScreen', {
      orderId: item.orderId,
      date: dayjs(item.updateAt).toISOString(),
    });
  };
  const area = item.customerZone;
  const orderNo = item.spNo;
  const shopName = item.customerName;
  const status = item.status;
  const price = item.price;
  const orderProducts = item.orderProducts;
  const getOnlySixLength = orderProducts
    .filter(el => !el.isFreebie)
    .slice(0, 6);
  return (
    <View style={styles.card}>
      <View>
        <View
          style={[
            styles.flexRow,
            {
              justifyContent: 'space-between',
              width: '100%',
              paddingLeft: 14,
              paddingRight: 16,
            },
          ]}>
          <View style={styles.flexRow}>
            <Image
              style={{
                width: 24,
                height: 24,
                marginRight: 6,
              }}
              resizeMode="contain"
              source={icons.invoice}
            />
            <View>
              <Text bold fontSize={14}>
                {orderNo}
              </Text>
              <Text bold fontSize={14}>
                {shopName}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onPress}>
            <Text color="primary" fontSize={14} lineHeight={28}>
              ดูรายละเอียด
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.flexRow,
            {
              justifyContent: 'space-between',
              width: '100%',
              marginTop: 8,
              paddingHorizontal: 16,
            },
          ]}>
          <View style={styles.flexRow}>
            <View style={styles.flexRow}>
              <Image
                style={{
                  width: 13,
                  height: 13,
                  marginRight: 6,
                }}
                source={icons.package}
              />
              <Text color="text3" fontSize={12}>{`${0} รายการ`}</Text>
            </View>
            <View
              style={{
                marginLeft: 10,
              }}>
              <Text color="text3" fontSize={12}>{`เขต ${area}`}</Text>
            </View>
          </View>
          <Text fontSize={12} color="text3">
            {dayjs(item.createAt).format('DD MMM BBBB , HH:mm น.')}
          </Text>
        </View>
      </View>

      <View style={styles.flexRowBody}>
        {getOnlySixLength.map((item, index) => {
          const isLast = index === 5 && orderProducts.length > 6;
          return isLast ? (
            <View
              style={{
                marginRight: 16,
              }}>
              <View
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.text1,
                  opacity: 0.5,
                  zIndex: 1,
                  position: 'absolute',
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text color="white" semiBold>{`+${
                  orderProducts.length - 6
                }`}</Text>
              </View>
              {item.productImage ? (
                <ImageCache
                  style={styles.images}
                  uri={getNewPath(item?.productImage)}
                />
              ) : (
                <Image source={images.emptyProduct} style={styles.images} />
              )}
            </View>
          ) : (
            <View
              key={index}
              style={{
                marginRight: 16,
              }}>
              {item.productImage ? (
                <ImageCache
                  style={{ width: 36, height: 36 }}
                  uri={getNewPath(item?.productImage)}
                />
              ) : (
                <Image
                  source={images.emptyProduct}
                  style={{ width: 36, height: 36 }}
                />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.flexRowFooter}>
        <BadgeStatus status={status} />
        <Text
          color="text2"
          fontFamily="NotoSans"
          semiBold>{`฿${numberWithCommas(price)}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border1,
    width: '100%',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.24,
    elevation: 5,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  flexRowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  images: {
    width: Dimensions.get('window').width / 6 - 64,
    height: Dimensions.get('window').width / 6 - 64,
    zIndex: -1,
  },
});
