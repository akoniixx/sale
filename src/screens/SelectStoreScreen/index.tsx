import { View } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useLocalization } from '../../contexts/LocalizationContext';
import SearchInput from '../../components/SearchInput/SearchInput';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import ListSearchResult from './ListSearchResult';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function SelectStoreScreen({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const mockData = [
    {
      id: 1,
      name: 'บริษัท ช. เกษตร 1881 จำกัด',
    },
    {
      id: 2,
      name: 'บริษัท นิยมชัยการเกษตร จำกัด Bangkok',
    },
    {
      id: 3,
      name: 'บริษัท เอี่ยวฮั่วล้ง จำกัด Bangkok',
    },
    {
      id: 4,
      name: 'บริษัท พีบี อโกรเทรด จำกัด Dusit',
    },
    {
      id: 5,
      name: 'บริษัท ยนต์นิรมิตคลังเกษตร จำกัด Ratchadaphisek',
    },
    {
      id: 6,
      name: 'บริษัท รุจ การค้า จำกัด Pathumwan',
    },
    {
      id: 7,
      name: 'บริษัท เกษตร 85 จำกัด Chatuchak',
    },
    {
      id: 8,
      name: 'บริษัท โซติสุพัฒน์ จำกัด Makkasan',
    },
    {
      id: 9,
      name: 'บริษัท ไทยรุ่งเรือง จำกัด Ekamai',
    },
  ];
  const data = mockData.filter(item => {
    if (searchValue) {
      return item.name.includes(searchValue);
    } else {
      return true;
    }
  });
  return (
    <Container>
      <Header title={t('screens.SelectStoreScreen.title')} />
      <Content
        style={{
          paddingHorizontal: 0,
          flex: 1,
          width: '100%',
        }}>
        <View
          style={{
            paddingHorizontal: 16,
            width: '100%',
          }}>
          <SearchInput
            value={searchValue}
            placeholder={t('screens.SelectStoreScreen.placeholder')}
            onChange={v => {
              setSearchValue(v);
            }}
          />
        </View>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.background1,
          }}>
          <Text color="text1" bold fontFamily="NotoSans">
            ร้านค้าในเขต A01
          </Text>
        </View>
        <ListSearchResult searchValue={searchValue} data={data} />
      </Content>
    </Container>
  );
}
