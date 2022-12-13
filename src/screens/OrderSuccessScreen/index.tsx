import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Header from '../../components/Header/Header';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Content from '../../components/Content/Content';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import DashedLine from 'react-native-dashed-line';
import { numberWithCommas } from '../../utils/functions';
import Button from '../../components/Button/Button';

export default function OrderSuccessScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'OrderSuccessScreen'>): JSX.Element {
  const mockData = [
    {
      productName: 'ไฮซีส',
      unit: 'ลัง',
      totalPrice: 131000,
      quantity: 10,
    },
    {
      productName: 'ไซม๊อกซิเมท',
      unit: 'ลัง',
      totalPrice: 131000,
      quantity: 10,
    },
    {
      productName: 'โบร์แลน',
      unit: 'ลัง',
      totalPrice: 5000,
      quantity: 5,
    },
  ];
  const totalPrice = mockData.reduce((acc, cur) => acc + cur.totalPrice, 0);
  const mockGiftData = [
    {
      productName: 'ไฮซีส',
      unit: 'ลัง',
      qauntity: 1,
    },
  ];
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Header
        style={{
          backgroundColor: colors.primary,
        }}
        titleColor="white"
        componentLeft={
          <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
            <Image
              source={icons.iconCloseWhite}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        }
        title="รอยืนยันคำสั่งซื้อ"
      />
      <Content
        style={{
          backgroundColor: colors.primary,
          paddingTop: 0,
          flex: 1,
        }}>
        <ScrollView
          style={styles().card}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 24,
              }}>
              <Text color="primary" bold fontFamily="NotoSans" fontSize={20}>
                บริษัท เอี่ยวฮั่วล้ง จำกัด
              </Text>
              <Image
                source={images.timer}
                style={{
                  width: 72,
                  height: 72,
                  marginTop: 16,
                }}
              />
            </View>
            <DashedLine dashColor={colors.border1} dashGap={6} />
            <View
              style={{
                paddingVertical: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
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
                  SP020110024
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}>
                <Text fontFamily="NotoSans" semiBold color="text2">
                  สินค้า
                </Text>
                <Text fontFamily="NotoSans" semiBold color="text2">
                  ราคารวม
                </Text>
              </View>
              {mockData.map((el, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 16,
                    }}>
                    <Text semiBold color="text2" fontSize={14}>
                      {el.productName} {`${el.quantity}x`} {`(${el.unit})`}
                    </Text>
                    <Text
                      fontFamily="NotoSans"
                      semiBold
                      color="text2"
                      fontSize={14}>
                      {`฿${numberWithCommas(el.totalPrice, true)}`}
                    </Text>
                  </View>
                );
              })}
            </View>
            <DashedLine dashColor={colors.border1} dashGap={6} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 60,
                alignItems: 'center',
              }}>
              <Text fontFamily="NotoSans" semiBold color="text2">
                ราคารวม
              </Text>
              <Text fontSize={24} fontFamily="NotoSans" bold color="primary">
                {`฿${numberWithCommas(totalPrice, true)}`}
              </Text>
            </View>
            <DashedLine dashColor={colors.border1} dashGap={6} />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  height: 60,
                  alignItems: 'center',
                }}>
                <Text fontFamily="NotoSans" semiBold color="text2">
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 60,
                      alignItems: 'center',
                    }}>
                    <Text fontFamily="NotoSans" bold fontSize={18}>
                      ของแถมที่ได้รับ
                    </Text>
                  </View>
                </Text>
                <Text fontSize={14} fontFamily="NotoSans" bold color="text3">
                  {`ทั้งหมด ${mockGiftData.length} รายการ`}
                </Text>
              </View>
              {mockGiftData.length > 0 ? (
                <>
                  {mockGiftData.map((el, idx) => {
                    return (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={images.emptyProduct}
                          style={{
                            width: 56,
                            height: 56,
                          }}
                        />
                        <View
                          style={{
                            marginLeft: 8,
                          }}>
                          <Text fontSize={14} color="text3">
                            {el.productName}
                          </Text>
                          <Text fontSize={14}>
                            {el.qauntity} {el.unit}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.emptyGift}
                    style={{
                      width: 140,
                      height: 140,
                    }}
                  />
                  <Text color="text3" center fontFamily="NotoSans">
                    ไม่มีของแถมที่ได้รับ
                  </Text>
                </View>
              )}
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
              }}>
              <TouchableOpacity style={{ height: 40 }}>
                <Text color="primary" fontSize={14}>
                  ดูรายละเอียดคำสั่งซื้อนี้
                </Text>
              </TouchableOpacity>
              <Button title="ดูคำสั่งซื้อทั้งหมด" />
            </View>
          </View>
        </ScrollView>
        <Image
          style={{
            width: '100%',
            height: 32,
          }}
          source={images.bottomSlip}
        />
      </Content>
    </SafeAreaView>
  );
}
const styles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flex: 1,
    },
  });
};
