import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
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
import AutoCompleteSearch from '../../components/AutoCompleteSearch/AutoCompleteSearch';
import { SheetManager } from 'react-native-actions-sheet';
import { Image } from 'react-native';
import icons from '../../assets/icons';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import ListFlatList from './ListFlatList';
import { SpecialRequestServices } from '../../services/SpecialRequestServices';
import { useAuth } from '../../contexts/AuthContext';

const initialPage = 1;
const mockData = [
  { id: 'd55b7c51-21c4-40e7-8832-edae0365b55f', title: 'Fashion Hub' },
  { id: 'b6ccafd8-0988-427f-8f33-59ce4fccc860', title: 'Gadget World' },
  { id: '9579637c-ee78-4727-9a9e-3f5fadfe1a5c', title: 'Furniture Gallery' },
  { id: '84ea085e-2db7-4873-93cc-0e6126235e82', title: 'QuickMart' },
  { id: 'c5ab17bf-80c3-45f6-85df-64fa0875879d', title: 'Pet Paradise' },
  { id: 'aeb8f1f2-41aa-4612-9cc2-8a0df3721af1', title: 'Family Paradise' },
  { id: 'bb6a0f29-2d6f-433d-b2a1-b4430c92a8e3', title: 'Garden Essentials' },
  { id: '172ff4fd-c73e-4c08-9bcc-791028924724', title: 'Luxury Watches' },
  { id: '8e83200b-744a-4aba-b6b6-7e2e78b7cb82', title: 'Golden World' },
  { id: '7746ad1f-767f-4827-b39f-855f00c05939', title: 'Genit World' },
];

const mockArea = [
  {
    id: '1',
    title: 'A01',
  },
  {
    id: '2',
    title: 'A02',
  },
  {
    id: '3',
    title: 'A03',
  },
  {
    id: '4',
    title: 'C01',
  },
  {
    id: '5',
    title: 'C02',
  },
];

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

export default function SpecialRequestApproveScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'SpecialRequestApproveScreen'>) {
  const {
    state: { user },
  } = useAuth();
  const { countSpecialRequest } = useSpecialRequest();
  const [currentTab, setCurrentTab] = React.useState(0);
  const [page, setPage] = React.useState(initialPage);
  const [searchValue, setSearchValue] = React.useState<SearchState>({
    searchText: '',
    area: [],
    dateRange: { startDate: '', endDate: '' },
  });
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
        searchText: '',
      }));
    }
  };

  const onSelectArea = async () => {
    const result: string[] = await SheetManager.show('select-area', {
      payload: {
        listArea: mockArea,
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

  useEffect(() => {
    const getSpecialRequest = async () => {
      try {
        const result = await SpecialRequestServices.getListSpecialRequest({
          page,
          startDate: searchValue.dateRange?.startDate,
          endDate: searchValue.dateRange?.endDate,
          searchText: searchValue.searchText,
          company: user?.company as 'ICPL' | 'ICPI' | 'ICPF',
          status: mappingTabStatus[currentTab as 0 | 1 | 2],
          search: searchValue.searchText,
          customerZones: user?.zone as string[],
        });
        if (result) {
          setDataList(result);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    getSpecialRequest();
  }, [searchValue, page, currentTab, user?.company, user?.zone]);

  const TAB_LIST = useMemo(() => {
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
  }, [countSpecialRequest]);

  const getSuggestions = (value: string) => {
    const suggestions = mockData.filter(item => item.title.includes(value));

    return suggestions;
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
              setCurrentTab={setCurrentTab}
            />
          </View>
          <ListFlatList
            currentTab={currentTab}
            data={dataList}
            navigation={navigation}
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
