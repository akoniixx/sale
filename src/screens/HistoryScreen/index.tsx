import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { firebaseInitialize } from '../../firebase/notification';

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
export interface HistoryTypeStore {
  customerCompanyId: number;
  customerName: string;
  customerNo: string;
  customerType: string;
  customerImage: string | null;
  zone: string;
  orderCount: number;
  customerProvince: string;
}
export default function HistoryScreen({ navigation }: any): JSX.Element {
  const [searchValue, setSearchValue] = React.useState<string | undefined>();
  const [typeSearch, setTypeSearch] = React.useState<string>('area');
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({ startDate: undefined, endDate: undefined });
  const [customerCompanyId, setCustomerCompanyId] = React.useState<
    number | undefined
  >(undefined);

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
    const tabDataIF = [
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
        label: 'รอขึ้นสินค้า',
        value: 'IN_DELIVERY',
      },
      {
        label: 'ขึ้นสินค้าเรียบร้อยแล้ว',
        value: 'DELIVERY_SUCCESS',
      },
      {
        label: 'ยกเลิกคำสั่งซื้อ',
        value: 'REJECT_ORDER',
      },
    ];
    return {
      tabData:
        user?.company === 'ICPF' || user?.company === 'ICPI'
          ? tabDataIF
          : tabData,
    };
  }, [user?.company]);
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
  const [historyDataStore, setHistoryDataStore] = React.useState<
    HistoryTypeStore[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [debounceSearchValue, setDebounceSearchValue] = React.useState<
    string | undefined
  >('');
  const isHasCustomerId = useMemo(() => {
    return customerCompanyId !== undefined;
  }, [customerCompanyId]);
  const [customerName, setCustomerName] = React.useState<string | undefined>(
    '',
  );
  const onSearch = (v: string | undefined) => {
    setDebounceSearchValue(v);
  };
  const [zone, setZone] = React.useState<string | undefined>('');
  const isSaleManager = useMemo(() => {
    if (user) {
      return user?.role === 'SALE MANAGER';
    } else {
      return false;
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const payload: any = {
        status: tabValue.length > 0 ? tabValue : [],
        search: debounceSearchValue,
        take: limit,
        company: user?.company || '',
        page: 1,
        endDate: dateRange.endDate,
        startDate: dateRange.startDate,
      };
      if (isHasCustomerId) {
        payload.customerCompanyId = customerCompanyId;
      }
      if (tabValue.length > 0) {
        payload.status = tabValue;
      }
      if (isSaleManager) {
        payload.zone = zone ? zone : Array.isArray(user?.zone) && user?.zone[0];
        if (!zone) {
          setZone(payload.zone);
        }
      } else {
        payload.zone = user?.zone;
        payload.userStaffId = user?.userStaffId;
      }

      try {
        const data = await historyServices.getHistory(payload);
        setHistoryData(data);
        setLoading(false);
      } catch (e) {
        console.log('error', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    tabValue,
    debounceSearchValue,
    dateRange.endDate,
    dateRange.startDate,
    user?.company,
    typeSearch,
    user?.userStaffId,
    tabData,
    isHasCustomerId,
    customerCompanyId,
    user?.zone,
    isSaleManager,
    zone,
  ]);
  useFocusEffect(
    useCallback(() => {
      firebaseInitialize();
      analytics().logScreenView({
        screen_name: 'HistoryScreen',
      });
      const fetchData = async () => {
        setLoading(true);
        const payload: any = {
          status: tabValue.length > 0 ? tabValue : [],
          search: debounceSearchValue,
          take: limit,
          company: user?.company || '',
          page: 1,
          endDate: dateRange.endDate,
          startDate: dateRange.startDate,
          customerCompanyId: customerCompanyId,
        };

        if (isSaleManager) {
          payload.zone = zone
            ? zone
            : Array.isArray(user?.zone) && user?.zone[0];
        } else {
          payload.zone = user?.zone;
          payload.userStaffId = user?.userStaffId;
        }

        if (isHasCustomerId) {
          payload.customerCompanyId = customerCompanyId;
        }
        if (tabValue.length > 0) {
          payload.status = tabValue;
        }
        console.log('payload', payload);
        try {
          const data = await historyServices.getHistory(payload);
          setHistoryData(data);
          setLoading(false);
        } catch (e) {
          console.log('error', e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearchValue, tabValue, zone]),
  );

  useEffect(() => {
    const fetchDataStore = async () => {
      try {
        const payload: any = {
          endDate: dateRange.endDate,
          startDate: dateRange.startDate,
          status: tabValue.length > 0 ? tabValue : [],
          search: debounceSearchValue,
        };
        if (tabValue.length > 0) {
          payload.status = tabValue;
        }

        if (isSaleManager) {
          payload.zone = zone
            ? zone
            : Array.isArray(user?.zone) && user?.zone[0];
        } else {
          payload.userStaffId = user?.userStaffId;
        }
        const data = await historyServices.getHistoryStore(payload);
        setHistoryDataStore(data);
      } catch (e) {
        console.log('e', e);
      }
    };
    if (typeSearch === 'store') {
      fetchDataStore();
    }
  }, [
    user?.userStaffId,
    typeSearch,
    tabValue,
    debounceSearchValue,
    dateRange.endDate,
    dateRange.startDate,
    zone,
    isSaleManager,
    user?.zone,
  ]);
  const fetchDataMore = async () => {
    if (historyData.data.length < historyData.count) {
      try {
        const payload: any = {
          status: tabValue.length > 0 ? tabValue : [],
          search: debounceSearchValue,
          take: limit,
          company: user?.company || '',
          page: page + 1,
          endDate: dateRange.endDate,
          startDate: dateRange.startDate,
        };
        if (isHasCustomerId) {
          payload.customerCompanyId = customerCompanyId;
        }
        if (isSaleManager) {
          payload.zone = zone
            ? zone
            : Array.isArray(user?.zone) && user?.zone[0];
        } else {
          payload.zone = user?.zone;
          payload.userStaffId = user?.userStaffId;
        }
        if (tabValue.length > 0) {
          payload.status = tabValue;
        }
        const data = await historyServices.getHistory(payload);
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
          onSearch={onSearch}
          value={searchValue}
          style={{
            width: '100%',
          }}
          placeholder={'ค้นหาเลขใบสั่งซื้อ, ร้านค้า...'}
          onChange={v => {
            setSearchValue(v);
            setPage(1);
          }}
        />
      </View>

      <View style={styles().containerFilter}>
        <View style={styles().flexRow}>
          <TouchableOpacity
            onPress={async () => {
              if (isSaleManager) {
                const result: string = await SheetManager.show(
                  'select-area-only-once',
                  {
                    payload: {
                      listArea: (user?.zone as string[]).map((el, index) => {
                        return { title: el, id: index };
                      }),
                      currentVal: zone,
                    },
                  },
                );
                if (result) {
                  setZone(result);
                }
              }
              setTypeSearch('area');
              setCustomerCompanyId(undefined);
              setTabValue([]);
              setPage(1);
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
            {isSaleManager ? (
              <Text
                bold
                color={typeSearch === 'area' ? 'primary' : 'text3'}
                fontFamily="NotoSans"
                fontSize={14}>{`รายเขต (${zone})`}</Text>
            ) : (
              <Text
                bold
                color={typeSearch === 'area' ? 'primary' : 'text3'}
                fontFamily="NotoSans"
                fontSize={14}>{`รายเขต (${user?.zone})`}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTypeSearch('store');
              setTabValue([]);
              setPage(1);
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
      {typeSearch === 'store' && (
        <View
          style={{
            height: 58,
            borderTopWidth: 1,
            borderTopColor: colors.border1,
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            backgroundColor: colors.background1,
            paddingHorizontal: 16,
          }}>
          {!isHasCustomerId ? (
            <View>
              <Text color="text3" fontSize={12} lineHeight={26}>
                คำสั่งซื้อ
              </Text>
              <Text color="text2" lineHeight={28}>
                ร้านทั้งหมด
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setCustomerName('');
                  setCustomerCompanyId(undefined);
                  setTabValue([]);
                  setPage(1);
                }}
                style={{
                  marginRight: 8,
                  marginTop: 4,
                }}>
                <Image
                  source={icons.backIcon}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </TouchableOpacity>
              <View>
                <Text color="text3" fontSize={12} lineHeight={24}>
                  คำสั่งซื้อของ
                </Text>
                <Text color="text2" lineHeight={26}>
                  {customerName}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

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
          setPage={setPage}
          setCustomerName={setCustomerName}
          data={historyData.data}
          dataCustomer={historyDataStore}
          navigation={navigation}
          typeSearch={typeSearch}
          customerCompanyId={customerCompanyId}
          setCustomerCompanyId={setCustomerCompanyId}
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
