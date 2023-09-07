import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import TabSelector from '../../components/TabSelector/TabSelector';
import { colors } from '../../assets/colors/colors';
import Body from './Body';
import { useAuth } from '../../contexts/AuthContext';
import { notiListServices } from '../../services/NotiListServices';
import { NotificationList } from '../../entities/notiListTypes';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useFocusEffect } from '@react-navigation/native';
interface Props {
  navigation?: any;
}
export default function NotificationScreen({ navigation }: Props) {
  const tabData = [
    {
      value: 'order',
      label: 'คำสั่งซื้อ',
    },
    // {
    //   value: 'promotion',
    //   label: 'โปรโมชั่น',
    // },
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
  const [page, setPage] = React.useState<number>(1);

  const fetchNotiList = async() => {
    setLoading(true)
   try {
   notiListServices.getNotilist(page,limit,'ASC',user?.userStaffId||'')
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
    }, 1000)
   }
  }

  const fetchDataMore = async () => {
    if (notiList.data.length < notiList.count) {
      try {
        const data = await  notiListServices.getNotilist(page+1,limit,'ASC',user?.userStaffId||'');
        setNotiList({
          ...notiList,
          data: [...notiList.data, ...data.data],
        });
        setPage(page + 1);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('no more data');
    }
  };

  useEffect(()=>{
    fetchNotiList()
  },[])
  
  useFocusEffect(
    useCallback(() => {
      fetchNotiList()
    }, []),
  );


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
        <Body data={notiList} fetchDataMore={fetchDataMore} navigation={navigation}/>
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}
