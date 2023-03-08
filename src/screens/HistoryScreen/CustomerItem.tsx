import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import images from '../../assets/images';
import icons from '../../assets/icons';
import { HistoryTypeStore } from '.';
import ImageCache from '../../components/ImageCache/ImageCache';
import { getNewPath } from '../../utils/functions';

interface Props extends HistoryTypeStore {
  navigation: any;
  onPress?: (id: number) => void;
}
export default function CustomerItem({ ...props }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress?.(props.customerCompanyId);
      }}
      style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {props.customerImage ? (
          <ImageCache
            uri={getNewPath(props.customerImage)}
            style={{
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
          }}>
          <Text semiBold lineHeight={28}>
            {props.customerName}
          </Text>
          <Text
            color="text3"
            fontSize={14}
            style={{
              marginTop: 4,
            }}>{`${props.zone}`}</Text>
          <TouchableOpacity style={styles.invoiceButton}>
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
          </TouchableOpacity>
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
