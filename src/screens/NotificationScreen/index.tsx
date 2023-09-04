import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import TabSelector from '../../components/TabSelector/TabSelector';
import { colors } from '../../assets/colors/colors';
import Body from './Body';
import { useAuth } from '../../contexts/AuthContext';
import { notiListServices } from '../../services/NotiListServices';
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
  const [loading,setLoading] = useState(false)
  const [notiList,setNotiList] = useState

  const fetchNotiList = async() => {
    setLoading(true)
   try {
   notiListServices.getNotilist(1,limit,'ASC',user?.userStaffId||'')

   } catch (error) {
    console.log(error)
   }
  }

  useEffect(()=>{
   
  },[])


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
        <Body />
      </Content>
    </Container>
  );
}
