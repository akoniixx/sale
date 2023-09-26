import { KeyboardAvoidingView, Platform, View } from 'react-native';
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

import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';

const StoreDetailScreen = ({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'StoreDetailScreen'>) => {
  const { name } = route.params;
  const [page, setPage] = React.useState(1);
  const {
    cartApi: { getCartList, postCartItem },
    setCartList,
  } = useCart();
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingApi(true);
        const { orderProducts } = await getCartList();
       
       /*  if (orderProducts && orderProducts.length > 0) {
          await postCartItem(orderProducts);
        } */
        setLoadingApi(false);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingApi(false);
      }
    };
    fetchData();
  }, []);
  const { t } = useLocalization();
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const [debounceSearchValue, setDebounceSearchValue] = React.useState<
    string | undefined
  >('');
  const onSearch = (v: string | undefined) => {
    setDebounceSearchValue(v);
  };
  return (
    <Container
      containerStyles={{
        paddingBottom: 50,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Header
        onBackCustom={() => {
          navigation.goBack();
          setCartList([]);
        }}
        title={t('screens.StoreDetailScreen.title')}
        componentRight={<CartBadge navigation={navigation} />}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
              onSearch={onSearch}
              placeholder={t('screens.StoreDetailScreen.searchPlaceholder')}
              value={searchValue}
              onChange={v => {
                setPage(1);
                setSearchValue(v);
              }}
            />
          </View>

          <ListItem
            page={page}
            setPage={setPage}
            loadingApi={loadingApi}
            nameDealer={name}
            navigation={navigation}
            debounceSearchValue={debounceSearchValue}
            setLoadingApi={setLoadingApi}
          />
        </Content>
      </KeyboardAvoidingView>
      <LoadingSpinner visible={loadingApi} />
    </Container>
  );
};

export default StoreDetailScreen;
