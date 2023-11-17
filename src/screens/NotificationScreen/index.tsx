import { View, Dimensions, Image, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';

import { colors } from '../../assets/colors/colors';
import Body from './Body';
import { useAuth } from '../../contexts/AuthContext';
import { notiListServices } from '../../services/NotiListServices';
import { NotificationList } from '../../entities/notiListTypes';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useFocusEffect } from '@react-navigation/native';
import TabSelector from '../../components/TabSelector/TabSelector';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import ItemNotification from './ItemNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemPromoNotification from './ItemPromoNotification';

interface Props {
  navigation?: any;
}
export default function NotificationScreen({ navigation }: Props) {
  const tabData = [
    {
      value: 'order',
      label: 'คำสั่งซื้อ',
    },
     {
       value: 'promotion',
       label: 'โปรโมชั่น',
     },
  ];
  
  const {
    state: { user },
  } = useAuth();
  const limit = 10;
  const [currentTab, setCurrentTab] = React.useState('order');
  const [loading,setLoading] = useState<boolean>(false)
  const [notiList,setNotiList] = useState<NotificationList>({
    data:[],
    count:0
  })
  const [pageNoti, setPageNoti] = React.useState<number>(1);
  const [pagePromoNoti, setPagePromoNoti] = React.useState<number>(1);
  const [promoNotiList,setPromoNotiList] = useState<NotificationList>({
    data:[],
    count:0
  })

  const fetchNotiList = async() => {
    setLoading(true)
   try {
    console.log(user?.userStaffId)
   notiListServices.getNotilist(pageNoti,limit,'DESC',user?.userStaffId||'')
   .then((res)=>{
    
    setNotiList(res)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
   
   })

   } catch (error) {
    console.log(error)
   } finally{
    setTimeout(() => {
      setLoading(false)
    }, 1000);
   }
  }

  const fetchNotiPromoList = async() => {
    setLoading(true)
    
   try {
    const company = await AsyncStorage.getItem('company');
   notiListServices.getPromoNotilist(pagePromoNoti,limit,'DESC',user?.userStaffId||'')
   .then((res)=>{
    setPromoNotiList(res)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
   
   })

   } catch (error) {
    console.log(error)
   } finally{
    setTimeout(() => {
      setLoading(false)
    }, 1000);
   }
  }

  const fetchDataMore = async () => {
    if (notiList.data.length < notiList.count) {
      try {
        const data = await  notiListServices.getNotilist(pageNoti+1,limit,'DESC',user?.userStaffId||'');
        setNotiList({
          ...notiList,
          data: [...notiList.data, ...data.data],
        });
        setPageNoti(pageNoti + 1);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('no more data');
    }
  };

  const fetchPromoDataMore = async () => {
    if (promoNotiList.data.length < promoNotiList.count) {
      try {
        const company = await AsyncStorage.getItem('company');
        const data = await  notiListServices.getPromoNotilist(pageNoti+1,limit,'DESC',user?.userStaffId||'');
        setPromoNotiList({
          ...promoNotiList,
          data: [...promoNotiList.data, ...data.data],
        });
        setPagePromoNoti(pagePromoNoti + 1);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('no more data');
    }
  };

  useEffect(()=>{
    fetchNotiPromoList()
    fetchNotiList()
  },[])
  
  useFocusEffect(
    useCallback(() => {
      fetchNotiPromoList()
      fetchNotiList()
    }, []),
  );

 
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
         {currentTab==='order'? 'ไม่พบรายการคำสั่งซื้อ': 'ไม่พบรายการโปรโมชัน' } 
        </Text>
      </View>
    );
  };

  return (
    <Container edges={['left', 'right', 'top']}>
      <Header componentLeft={<View />} title="การแจ้งเตือน" />

      <Content
        noPadding
        style={{
          flex: 1,

          backgroundColor: colors.background1,
        }}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            backgroundColor: colors.white,
            height: 60,
          }}>
          <TabSelector
            onChangeTab={v => {
              setCurrentTab(v);
            }}
            tabWidth={100}
            tabs={tabData}
            active={tabData.findIndex(v => v.value === currentTab)}
          />
        </View>
        {currentTab==='order'?
         <FlatList
         ListEmptyComponent={<EmptyItem />}
         data={notiList.data}
         onEndReached={fetchDataMore}
         onEndReachedThreshold={0.2}
         renderItem={({ item }) => {
           return <ItemNotification data={item} fetchDataMore={fetchDataMore} navigation={navigation}/>;
         }}
       />:
       <FlatList
       ListEmptyComponent={<EmptyItem />}
       data={promoNotiList.data}
       onEndReached={fetchPromoDataMore}
       onEndReachedThreshold={0.2}
       renderItem={({ item }) => {
         return <ItemPromoNotification data={item} fetchDataMore={fetchPromoDataMore} navigation={navigation}/>;
       }}
     />
      }
       
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}

