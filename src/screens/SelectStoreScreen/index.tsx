import { View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useLocalization } from '../../contexts/LocalizationContext';
import SearchInput from '../../components/SearchInput/SearchInput';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import ListSearchResult from './ListSearchResult';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { customerServices } from '../../services/CustomerServices';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function SelectStoreScreen({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );

  const {
    state: { user },
  } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [listStore, setListStore] = React.useState<
    {
      customerCompany: {
        customerId: string;
        customerName: string;
        customerNo: string;
        customerCompanyId: string;
        productBrand: [];
      }[];
    }[]
  >([]);

  useEffect(() => {
    const getListStore = async () => {
      try {
        const data = await customerServices.getDealerZoneById(
          user?.userStaffId || '',
        );

        setListStore(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    if (user?.userStaffId) {
      getListStore();
    }
  }, [user]);
  const data = useMemo(() => {
    const newFormat = listStore.map(el => {
      const c = el.customerCompany?.[0];

      return {
        name: c.customerName,
        id: c.customerId,
        customerCompanyId: c.customerCompanyId,
        customerNo: c.customerNo,
        productBrand: c.productBrand,
        moreThanOneBrand: c.productBrand?.length > 1,
      };
    });
    return newFormat.filter(i => {
      if (!searchValue) return true;
      return i.name.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [listStore, searchValue]);

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
            {t('screens.SelectStoreScreen.listStore', {
              area: user?.zone,
            })}
          </Text>
        </View>
        <ListSearchResult
          searchValue={searchValue}
          data={data}
          navigation={navigation}
        />
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}
