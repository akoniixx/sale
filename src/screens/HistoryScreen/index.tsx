import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import SearchInput from '../../components/SearchInput/SearchInput';
import ContentBody from './ContentBody';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import { useAuth } from '../../contexts/AuthContext';
import icons from '../../assets/icons';
import TabSelector from '../../components/TabSelector/TabSelector';
import { SheetManager } from 'react-native-actions-sheet';
import { historyServices } from '../../services/HistoryServices';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { HistoryDataType } from '../../entities/historyTypes';
import { useDebounce } from '../../hook';

interface TypeHistory {
  data: HistoryDataType[];
  count: number;
  dashboard: {
    waitConfirmStatusCount: 0;
    confirmStatusCount: 0;
    inDeliveryCount: 0;
    deliverySuccessCount: 0;
  };
}
export default function HistoryScreen({ navigation }: any): JSX.Element {
  const [searchValue, setSearchValue] = React.useState<string | undefined>();
  const [typeSearch, setTypeSearch] = React.useState<string>('area');
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({ startDate: undefined, endDate: undefined });

  const [tabValue, setTabValue] = React.useState<string[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const limit = 10;
  const {
    state: { user },
  } = useAuth();
  const { tabData } = useMemo(() => {
    const tabData = [
      {
        label: 'รออนุมัติคำสั่งซื้อ',
        value: 'WAIT_APPROVE_ORDER',
      },
      {
        label: 'รอยืนยันคำสั่งซื้อ',
        value: 'WAIT_CONFIRM_ORDER',
      },
      {
        label: 'ร้านยืนยันคำสั่งซื้อแล้ว',
        value: 'CONFIRM_ORDER',
      },
      {
        label: 'เปิดรายการคำสั่งซื้อแล้ว',
        value: 'OPEN_ORDER',
      },
      {
        label: 'กำลังจัดส่ง',
        value: 'IN_DELIVERY',
      },
      {
        label: 'ลูกค้ารับสินค้าแล้ว',
        value: 'DELIVERY_SUCCESS',
      },
      {
        label: 'ยกเลิกคำสั่งซื้อ',
        value: 'REJECT_ORDER',
      },
    ];
    return { tabData };
  }, []);
  const [historyData, setHistoryData] = React.useState<TypeHistory>({
    data: [],
    count: 0,
    dashboard: {
      waitConfirmStatusCount: 0,
      confirmStatusCount: 0,
      inDeliveryCount: 0,
      deliverySuccessCount: 0,
    },
  });
  const [historyDataStore, setHistoryDataStore] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [debounceSearchValue] = useDebounce(searchValue, 500);
  // console.log('historyData', JSON.stringify(historyData.data, null, 2));
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await historyServices.getHistory({
          status: tabValue,
          search: debounceSearchValue,
          take: limit,
          company: user?.company || '',
          page: 1,
          endDate: dateRange.endDate,
          startDate: dateRange.startDate,
        });
        setHistoryData(data);
        setLoading(false);
      } catch (e) {
        console.log(e.response.data);
      } finally {
        setLoading(false);
      }
    };
    const fetchDataStore = async () => {
      try {
        console.log('fetchDataStore');

        const data = await historyServices.getHistoryStore(
          user?.userStaffId || '',
        );
        console.log('data', data);
      } catch (e) {
        console.log('e', e);
      }
    };
    if (typeSearch === 'area') {
      fetchData();
    } else {
      fetchDataStore();
    }
  }, [
    tabValue,
    debounceSearchValue,
    dateRange.endDate,
    dateRange.startDate,
    user?.company,
    typeSearch,
    user?.userStaffId,
  ]);
  const fetchDataMore = async () => {
    if (historyData.data.length < historyData.count) {
      try {
        const data = await historyServices.getHistory({
          status: tabValue,
          search: debounceSearchValue,
          take: limit,
          company: user?.company || '',
          page: page + 1,
          endDate: dateRange.endDate,
          startDate: dateRange.startDate,
        });
        setHistoryData({
          ...historyData,
          data: [...historyData.data, ...data.data],
        });
        setPage(page + 1);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('no more data');
    }
  };
  return (
    <Container edges={['left', 'right', 'top']}>
      <Header
        componentLeft={<View style={{ width: 24 }} />}
        title="ประวัติการสั่งซื้อ"
      />
      <View
        style={{
          paddingHorizontal: 16,
          width: '100%',
        }}>
        <SearchInput
          value={searchValue}
          style={{
            width: '100%',
          }}
          placeholder={'ค้นหาเลขใบสั่งซื้อ, ร้านค้า...'}
          onChange={v => {
            setSearchValue(v);
          }}
        />
      </View>

      <View style={styles().containerFilter}>
        <View style={styles().flexRow}>
          <TouchableOpacity
            onPress={() => {
              setTypeSearch('area');
            }}
            style={styles().flexRow}>
            <Image
              source={
                typeSearch !== 'area'
                  ? icons.iconLocationInActive
                  : icons.iconLocationActive
              }
              style={styles().icon}
              resizeMode="contain"
            />
            <Text
              bold
              color={typeSearch === 'area' ? 'primary' : 'text3'}
              fontFamily="NotoSans"
              fontSize={14}>{`รายเขต (${user?.zone})`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTypeSearch('store');
            }}
            style={styles().flexRow}>
            <Image
              source={
                typeSearch !== 'area'
                  ? icons.iconStoreActive
                  : icons.iconStoreInActive
              }
              style={styles().icon}
              resizeMode="contain"
            />
            <Text
              bold
              color={typeSearch !== 'area' ? 'primary' : 'text3'}
              fontFamily="NotoSans"
              fontSize={14}>{`รายร้าน`}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={async () => {
              const currentDate: {
                startDate: Date | undefined;
                endDate: Date | undefined;
              } = await SheetManager.show('select-date-range', {
                payload: {
                  dateRange,
                },
              });
              if (!currentDate) {
                return;
              }
              setDateRange(currentDate);
              setPage(1);
            }}
            style={[
              styles().flexRow,
              {
                marginRight: 0,
              },
            ]}>
            <Text
              style={{
                marginRight: 4,
              }}
              lineHeight={28}
              color={'text3'}
              fontSize={14}>{`วันที่ทั้งหมด`}</Text>
            <Image
              source={icons.iconCalendar}
              style={styles().icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: 58,
          borderTopWidth: 1,
          borderTopColor: colors.border1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TabSelector
          tabs={tabData}
          active={tabData.findIndex(tab => tabValue.includes(tab.value))}
          onChangeTab={tab => {
            if (tabValue.includes(tab)) {
              setTabValue([]);
            } else {
              if (tab === 'REJECT_ORDER') {
                setTabValue([
                  'COMPANY_CANCEL_ORDER',
                  'SHOPAPP_CANCEL_ORDER',
                  'REJECT_ORDER',
                ]);
              } else {
                setTabValue([tab]);
              }
            }
            setPage(1);
          }}
        />
      </View>

      <Content
        noPadding
        style={{
          backgroundColor: colors.background1,
        }}>
        <ContentBody
          data={historyData.data}
          navigation={navigation}
          typeSearch={typeSearch}
          fetchDataMore={fetchDataMore}
        />
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}

const styles = () => {
  return StyleSheet.create({
    containerFilter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 4,
    },
  });
};