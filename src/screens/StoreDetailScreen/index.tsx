import { View } from 'react-native';
import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import SearchInput from '../../components/SearchInput/SearchInput';
import ListItem from './ListItem';
import CartBadge from '../../components/CartBadge/CartBadge';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { useDebounce } from '../../hook';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const StoreDetailScreen = ({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'StoreDetailScreen'>) => {
  const { name, productBrand } = route.params;

  const { t } = useLocalization();
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const [debounceSearchValue, loading] = useDebounce(searchValue, 500);
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);

  return (
    <Container>
      <Header
        title={t('screens.StoreDetailScreen.title')}
        componentRight={<CartBadge navigation={navigation} />}
      />
      <Content
        style={{
          padding: 0,
          flex: 1,
          width: '100%',
        }}>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <SearchInput
            value={searchValue}
            onChange={v => {
              setSearchValue(v);
            }}
          />
        </View>
        <ListItem
          nameDealer={name}
          navigation={navigation}
          debounceSearchValue={debounceSearchValue}
          productBrand={productBrand}
          setLoadingApi={setLoadingApi}
        />
      </Content>
      <LoadingSpinner visible={loading || loadingApi} />
    </Container>
  );
};

export default StoreDetailScreen;
