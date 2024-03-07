import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { HeaderFlatList } from '../../components/HeaderFlatList/HeaderFlatList';
import {
  SpecialRequestType,
  useSpecialRequest,
} from '../../contexts/SpecialRequestContext';
import { colors } from '../../assets/colors/colors';
import SearchInput from '../../components/SearchInput/SearchInput';
import { useDebounce } from '../../hook';
import AutoCompleteSearch, {
  SuggestionListType,
} from '../../components/AutoCompleteSearch/AutoCompleteSearch';
import { SheetManager } from 'react-native-actions-sheet';
import { Image } from 'react-native';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import ListFlatList from './ListFlatList';
import {
  SpecialRequestGet,
  SpecialRequestServices,
} from '../../services/SpecialRequestServices';
import { useAuth } from '../../contexts/AuthContext';
import { orderServices } from '../../services/OrderServices';

const initialPage = 1;

interface SearchState {
  searchText?: string;
  area: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

const mappingTabStatus = {
  0: ['WAIT_APPROVE_ORDER'],
  1: ['WAIT_CONFIRM_ORDER'],
  2: ['REJECT_ORDER'],
};

const initialSearch: SearchState = {
  searchText: '',
  area: [],
  dateRange: { startDate: '', endDate: '' },
};
export default function SpecialRequestApproveScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SpecialRequestApproveScreen'>) {
  const {
    state: { user },
  } = useAuth();

  const { countSpecialRequest } = useSpecialRequest();
  const [currentTab, setCurrentTab] = React.useState(0);
  const [page, setPage] = React.useState(initialPage);
  const [searchValue, setSearchValue] =
    React.useState<SearchState>(initialSearch);
  const [dataList, setDataList] = React.useState<{
    count: number;
    data: SpecialRequestType[];
  }>({
    count: 0,
    data: [],
  });

  const onSearchWithAutoComplete = (value: string | undefined | null) => {
    setPage(1);
    if (value) {
      setSearchValue(prev => ({
        ...prev,
        searchText: value,
      }));
    } else {
      setSearchValue(prev => ({
        ...prev,
        searchText: undefined,
      }));
    }
  };

  const onSelectArea = async () => {
    const listArea = Array.isArray(user?.zone)
      ? user?.zone.map((el, index) => {
          return {
            id: index.toString() + 1,
            title: el,
          };
        })
      : [];
    const result: string[] = await SheetManager.show('select-area', {
      payload: {
        listArea: listArea,
        currentVal: searchValue.area,
      },
    });
    if (result) {
      setSearchValue(prev => ({
        ...prev,
        area: result,
      }));
    }
  };
  const onSelectDateLength = async () => {
    const currentDate: {
      startDate: Date | undefined;
      endDate: Date | undefined;
    } = await SheetManager.show('select-date-range', {
      payload: {
        dateRange: searchValue.dateRange,
      },
    });
    if (!currentDate) {
      return;
    }
    const { startDate, endDate } = currentDate;
    if (startDate && endDate) {
      setSearchValue(prev => ({
        ...prev,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      }));
    }
    setPage(1);
  };

  const getSpecialRequest = useCallback(async () => {
    try {
      const payload = {
        page,
        startDate: searchValue.dateRange?.startDate,
        endDate: searchValue.dateRange?.endDate,
        company: user?.company as 'ICPL' | 'ICPI' | 'ICPF',
        status: mappingTabStatus[currentTab as 0 | 1 | 2],
        search: searchValue.searchText ? searchValue.searchText : '',
        customerZones:
          searchValue.area.length > 0
            ? searchValue.area
            : (user?.zone as string[]),
      } as SpecialRequestGet;

      const result = await SpecialRequestServices.getListSpecialRequest(
        payload,
      );
      if (result) {
        setDataList(result);
      }
    } catch (error) {
      console.log('error', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, page, currentTab, user?.company, user?.zone]);
  useEffect(() => {
    const getSpecialRequestInitial = async () => {
      try {
        const payload = {
          page: 1,
          startDate: searchValue.dateRange?.startDate,
          endDate: searchValue.dateRange?.endDate,
          company: user?.company as 'ICPL' | 'ICPI' | 'ICPF',
          status: mappingTabStatus[currentTab as 0 | 1 | 2],
          search: searchValue.searchText ? searchValue.searchText : '',
          customerZones:
            searchValue.area.length > 0
              ? searchValue.area
              : (user?.zone as string[]),
        } as SpecialRequestGet;

        const result = await SpecialRequestServices.getListSpecialRequest(
          payload,
        );
        if (result) {
          setDataList(result);
        }
      } catch (error) {
        console.log('error', error);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    getSpecialRequestInitial();
  }, [
    route.params?.backTime,
    searchValue,
    currentTab,
    user?.company,
    user?.zone,
  ]);

  const TAB_LIST = useMemo(() => {
    if (currentTab === 0) {
      const isFilter =
        searchValue.searchText ||
        searchValue.area.length > 0 ||
        (searchValue.dateRange?.endDate && searchValue.dateRange?.startDate);
      return [
        {
          label: `รออนุมัติ ${
            isFilter
              ? `(${dataList.count || 0})`
              : `(${countSpecialRequest || 0})`
          } `,
          value: 'wait',
        },
        { label: 'อนุมัติแล้ว', value: 'approve' },
        {
          label: 'ไม่อนุมัติ',
          value: 'notApprove',
        },
      ];
    }

    return [
      {
        label: `รออนุมัติ ${
          countSpecialRequest ? `(${countSpecialRequest || 0})` : ''
        }`,
        value: 'wait',
      },
      { label: 'อนุมัติแล้ว', value: 'approve' },
      {
        label: 'ไม่อนุมัติ',
        value: 'notApprove',
      },
    ];
  }, [countSpecialRequest, dataList.count, currentTab, searchValue]);

  const getSuggestions = async (value: string) => {
    try {
      const result = await orderServices.getOrderSearchSuggestions({
        searchText: value,
        status: mappingTabStatus[currentTab as 0 | 1 | 2],
      });
      if (result) {
        const newFormat = result.map(
          (el: { customerNo: string; customerName: string }) => {
            return {
              id: el.customerNo,
              title: el.customerName,
            };
          },
        );
        return newFormat as SuggestionListType[];
      } else {
        return [];
      }
    } catch (error) {
      console.log('error', error);
      return [];
    }
  };

  const isHaveDateRange = useMemo(() => {
    if (searchValue?.dateRange) {
      return searchValue.dateRange?.startDate && searchValue.dateRange?.endDate;
    }
    return false;
  }, [searchValue.dateRange]);

  const convertToStartEndDate = useMemo(() => {
    if (!searchValue.dateRange) {
      return '';
    }
    return `${dayjs(searchValue.dateRange?.startDate).format(
      'DD/MM/BBBB',
    )} - ${dayjs(searchValue.dateRange?.endDate).format('DD/MM/BBBB')}`;
  }, [searchValue.dateRange]);

  const isFilteredArea = useMemo(() => {
    return searchValue.area?.length > 0;
  }, [searchValue.area]);

  const onLoadMore = async () => {
    if (dataList.data.length < dataList.count) {
      const result = await SpecialRequestServices.getListSpecialRequest({
        page: page + 1,
        startDate: searchValue.dateRange?.startDate,
        endDate: searchValue.dateRange?.endDate,
        company: user?.company as 'ICPL' | 'ICPI' | 'ICPF',
        status: mappingTabStatus[currentTab as 0 | 1 | 2],
        search: searchValue.searchText ? searchValue.searchText : '',
        customerZones:
          searchValue.area.length > 0
            ? searchValue.area
            : (user?.zone as string[]),
      });
      setPage(prev => prev + 1);
      setDataList(prev => ({
        count: prev.count,
        data: prev.data.concat(result.data),
      }));
    }
  };

  return (
    <Container edges={['left', 'right', 'top']}>
      <Header title="อนุมัติคำสั่งซื้อ" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <Content
          noPadding
          style={{
            backgroundColor: colors.background2,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: colors.white,
            }}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingBottom: 0,
              }}>
              <AutoCompleteSearch
                onSearch={onSearchWithAutoComplete}
                getSuggestions={getSuggestions}
                placeholder="ค้นหาเลขใบสั่งซื้อ, ร้านค้า"
              />
              <View style={styles.row}>
                <TouchableOpacity onPress={onSelectArea} style={styles.flexRow}>
                  <Image
                    source={
                      isFilteredArea
                        ? icons.iconLocationActive
                        : icons.iconLocationInActive
                    }
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text
                    semiBold
                    color={isFilteredArea ? 'primary' : 'text3'}
                    fontFamily="NotoSans"
                    fontSize={14}>{`เขตการขาย`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onSelectDateLength}
                  style={[
                    styles.flexRow,
                    {
                      marginRight: 0,
                    },
                  ]}>
                  <Image
                    source={
                      isHaveDateRange
                        ? icons.iconCalendarActive
                        : icons.iconCalendar
                    }
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text
                    semiBold
                    color={isHaveDateRange ? 'primary' : 'text3'}
                    fontFamily="NotoSans"
                    fontSize={isHaveDateRange ? 16 : 14}>
                    {isHaveDateRange ? convertToStartEndDate : `วันที่ทั้งหมด`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: colors.border1,
                borderBottomWidth: 1,
                marginTop: 8,
              }}
            />
            <HeaderFlatList
              tabList={TAB_LIST}
              currentTab={currentTab}
              setCurrentTab={(index: number) => {
                setCurrentTab(index);
                setPage(1);
                setSearchValue(prev => ({
                  ...prev,
                  dateRange: initialSearch.dateRange,
                  area: initialSearch.area,
                }));
              }}
            />
          </View>
          <ListFlatList
            currentTab={currentTab}
            data={dataList}
            navigation={navigation}
            getSpecialRequest={getSpecialRequest}
            onLoadMore={onLoadMore}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
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
