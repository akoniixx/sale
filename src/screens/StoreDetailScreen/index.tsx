import { View } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import SearchInput from '../../components/SearchInput/SearchInput';
import ListItem from './ListItem';
import CartBadge from '../../components/CartBadge/CartBadge';
import { MainStackParamList } from '../../navigations/MainNavigator';

const StoreDetailScreen = ({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'StoreDetailScreen'>) => {
  const { id, name } = route.params;
  const { t } = useLocalization();
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );

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
        <ListItem data={[]} nameDealer={name} navigation={navigation} />
      </Content>
    </Container>
  );
};

export default StoreDetailScreen;
