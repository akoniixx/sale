import { View, Text } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import TabSelector from '../../components/TabSelector/TabSelector';
import { colors } from '../../assets/colors/colors';
import Body from './Body';
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
  const [currentTab, setCurrentTab] = React.useState('order');
  return (
    <Container>
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
