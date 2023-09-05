import { View, FlatList, Image, Dimensions } from 'react-native';
import React from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import ItemNotification from './ItemNotification';
import { NotificationList } from '../../entities/notiListTypes';


interface Props{
  data:NotificationList
  fetchDataMore:()=>Promise<void>
  navigation:any
  
}

export default function Body({data,fetchDataMore,navigation}:Props) {
  const EmptyItem = () => {
    return (
      <View
        style={{
          minHeight: Dimensions.get('window').height / 2,
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
        <Text fontFamily="NotoSans" color="text3">
          ไม่พบรายการคำสั่งซื้อ
        </Text>
      </View>
    );
  };
  return (
    <FlatList
      ListEmptyComponent={<EmptyItem />}
      data={data.data}
      onEndReached={fetchDataMore}
      onEndReachedThreshold={0.2}
      renderItem={({ item }) => {
        return <ItemNotification data={item} fetchDataMore={fetchDataMore} navigation={navigation}/>;
      }}
    />
  );
}
