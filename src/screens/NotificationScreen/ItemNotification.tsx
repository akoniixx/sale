import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import icons from '../../assets/icons';
import { Notification } from '../../entities/notiListTypes';
import ImageCache from '../../components/ImageCache/ImageCache';
import { getNewPath } from '../../utils/functions';
import { notiListServices } from '../../services/NotiListServices';
import { statusHistory } from '../../utils/mappingObj';
import { useAuth } from '../../contexts/AuthContext';
import images from '../../assets/images';

interface Props {
  data: Notification
  fetchDataMore: () => Promise<void>
  navigation: any



}
export default function ItemNotification({ data, fetchDataMore, navigation, ...props }: Props) {
  const {
    state: { user },
  } = useAuth();
  const isRead = data.isRead

  const statusText = (status: string) => {
    const title = statusHistory(user?.company || '')[
      status as keyof typeof statusHistory
    ];
    return title
  }

  const onPress = async (orderId: string, notiId: string,createdAt:string) => {
    const date = dayjs(createdAt).format('DD MMM BBBB');
    await notiListServices.readNoti(notiId)
      .then(() => {
        navigation.navigate('HistoryDetailScreen', {
          orderId: orderId,
          headerTitle: date,
        });
      })
      .catch(err => console.log(err))

  }
  return (
    <View style={[styles.card, { backgroundColor: isRead ? 'white' : '#F8FAFF' }]}>
      <TouchableOpacity onPress={() => onPress(data.orderId, data.notificationId,data.createdAt)} >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              backgroundColor: isRead ? colors.white : colors.error,
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
                {data.orderNo}
              </Text>{' '}
              จากร้าน บริษัท
            </Text>
            <Text lineHeight={30} semiBold>
              {data.customerName}
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
                “{statusText(data.orderStatus)}”
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
              <Text color="text3" fontSize={12}>{`${data.qtyItem} รายการ`}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10,alignItems:'center' }}>
              {data.product && data.product.map((p, idx) => {
                return (
                  <View key={idx}>
                    {idx < 6 ?
                      idx != 5 ?
                        <View style={{ marginHorizontal: 5 }}>
                          {p.productImage?
                          <ImageCache
                          uri={getNewPath(p.productImage)}
                          style={{
                            width: 36,
                            height: 36,
                          }}
                        />
                        :
                        <Image
                        source={images.emptyProduct}
                        style={{ width: 36, height: 36 }}
                      />
                        }
                          
                         
                        </View>
                        :
                        <View style={{ marginHorizontal: 5,padding:5 ,backgroundColor:'rgba(14, 14, 14, 0.4)',borderRadius:4}} >
                         <View style={{opacity:0.5}}>
                         {p.productImage?
                          <ImageCache
                          uri={getNewPath(p.productImage)}
                          style={{
                            width: 36,
                            height: 36,
                          }}
                        />
                        :
                        <Image
                        source={images.emptyProduct}
                        style={{ width: 36, height: 36 }}
                      />
                        }
                          </View>
                          <Text style={{ position: 'absolute', top: '25%', left: '30%' }} 
                          fontSize={16} 
                          color='white'
                           fontFamily='NotoSans' bold>{'+'+ (data.product.length-idx+2) }</Text>
                        </View>
                      : null
                    }

                  </View>

                )
              })}
            </View>
            <Text lineHeight={30} color="text3" fontSize={12}>
              {dayjs(data.createdAt).format('DD MMM BBBB , HH:mm น.')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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

  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
