import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import ImageCache from '../../components/ImageCache/ImageCache';
import images from '../../assets/images';

import icons from '../../assets/icons';
import dayjs from 'dayjs';
import Button from '../../components/Button/Button';
import { numberWithCommas } from '../../utils/functions';

export default function CancelOrderSuccessScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'CancelOrderSuccessScreen'>) {
  const {
    orderProducts = [],
    orderId,
    cancelRemark = '',
    orderNo,
    updateAt,
  } = route.params;
  const noFreebies = orderProducts.filter(el => el?.isFreebie === false);
  const date = dayjs(updateAt).format('DD MMM BBBB');
  return (
    <Container edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title="รายละเอียดการยกเลิก"
        componentLeft={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('HistoryDetailScreen', {
                orderId: orderId,
                headerTitle: date,
              });
            }}>
            <Image
              source={icons.closeBlack}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        }
      />
      <Content
        noPadding
        style={{
          backgroundColor: colors.background1,
        }}>
        <ScrollView>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background1,
            }}>
            <Image
              source={images.CancelImage}
              style={{
                width: 120,
                height: 120,
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              padding: 16,
              backgroundColor: colors.white,
            }}>
            <Text fontFamily="NotoSans" semiBold>
              เหตุผลที่ยกเลิก (พนักงานขาย)
            </Text>
            <Text color="text2">{cancelRemark}</Text>
          </View>
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 16,
              backgroundColor: colors.white,
              paddingBottom: 16,
            }}>
            <Text
              fontSize={16}
              color="text2"
              semiBold
              fontFamily="NotoSans"
              style={{
                marginVertical: 8,
              }}>
              สินค้าที่ยกเลิก
            </Text>

            {noFreebies.map((el, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 32,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    {el.productImage ? (
                      <ImageCache
                        uri={el.productImage}
                        style={{
                          width: 72,
                          height: 72,
                        }}
                      />
                    ) : (
                      <Image
                        source={images.emptyProduct}
                        style={{
                          width: 72,
                          height: 72,
                        }}
                      />
                    )}
                    <View
                      style={{
                        marginLeft: 16,
                      }}>
                      <Text semiBold>{el.productName}</Text>
                      <View
                        style={{
                          marginTop: 4,
                        }}>
                        <Text color="text3">
                          {numberWithCommas(el.quantity)}
                          {`  (${el.saleUOMTH || el.saleUOM})`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View
            style={{
              backgroundColor: 'white',
              //   shadowColor: '#000',
              //   shadowOffset: {
              //     width: 0,
              //     height: 2,
              //   },
              //   shadowOpacity: 0.25,
              //   shadowRadius: 2.84,
              //   elevation: 5,
              marginBottom: 18,
              zIndex: 0,
              paddingVertical: 16,
            }}>
            <View
              style={{
                paddingHorizontal: 16,

                paddingBottom: 16,
              }}>
              <Text fontFamily="NotoSans" semiBold>
                รายละเอียดการยกเลิก
              </Text>
              <Text color="text2">หมายเลขคำสั่งซื้อ : {orderNo}</Text>
              <Text color="text2">
                วันที่ยกเลิก :{' '}
                {dayjs(updateAt).locale('th').format('DD MMM BBBB HH:mm น.')}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 40,
              backgroundColor: colors.background1,
            }}
          />
        </ScrollView>
        <View style={styles.container}>
          <Button
            style={{
              marginBottom: 16,
            }}
            title="ดูข้อมูลออเดอร์"
            onPress={() => {
              navigation.navigate('HistoryDetailScreen', {
                orderId: orderId,
                headerTitle: date,
              });
            }}
          />
        </View>
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
