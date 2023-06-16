import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import images from '../../assets/images';
import icons from '../../assets/icons';
import { HistoryTypeStore } from '.';
import ImageCache from '../../components/ImageCache/ImageCache';

interface Props extends HistoryTypeStore {
  navigation: any;
  onPress?: (id: number, customerName: string) => void;
}
export default function CustomerItem({ ...props }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress?.(props.customerCompanyId, props.customerName);
      }}
      style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {props.customerImage ? (
          <ImageCache
            resizeMode="cover"
            uri={props.customerImage}
            style={{
              borderRadius: 12,
              width: 60,
              height: 60,
            }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              backgroundColor: colors.background1,
            }}>
            <Image
              source={images.emptyStore}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </View>
        )}

        <View
          style={{
            marginLeft: 16,
            alignSelf: 'flex-start',
            flex: 1,
          }}>
          <Text semiBold lineHeight={26}>
            {props.customerName}
          </Text>
          <Text
            color="text3"
            fontSize={14}
            style={{
              marginTop: 4,
            }}>{`${props.zone} | ${props.customerProvince} `}</Text>
          <View style={styles.invoiceButton}>
            <Image
              source={icons.invoice}
              style={{
                width: 16,
                height: 16,
              }}
            />
            <Text
              fontSize={12}
              lineHeight={20}
              color="primary"
              style={{
                marginLeft: 4,
              }}>
              {props.orderCount} คำสั่งซื้อ
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    flex: 1,
  },
  invoiceButton: {
    backgroundColor: 'rgba(76, 149, 255, 0.16)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginTop: 16,
    height: 28,
  },
});
