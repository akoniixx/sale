import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

interface Props {
  data: {
    id: string;
    name: string;
    customerNo: string;
    moreThanOneBrand: boolean;
    customerCompanyId: string;
    productBrand: {
      product_brand_id: string;
      product_brand_name: string;
      company: string;
    }[];
  }[];
  searchValue?: string | undefined;
  navigation: StackNavigationHelpers;
}
export default function ListSearchResult({
  data,
  navigation,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const { setItem } = useAsyncStorage('customerCompanyId');
  return (
    <FlatList
      data={data}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
          }}>
          <Image
            source={images.emptyStore}
            style={{
              width: 90,
              height: 90,
            }}
          />
          <Text color="text3" fontFamily="NotoSans">
            {t('screens.SelectStoreScreen.empty')}
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setItem(item.customerCompanyId);
              if (item.moreThanOneBrand) {
                navigation.navigate('SelectBrandBeforeDetailScreen', {
                  id: item.id,
                  name: item.name,
                  productBrand: item.productBrand,
                });
              } else {
                navigation.navigate('StoreDetailScreen', {
                  id: item.id,
                  name: item.name,

                  productBrand:
                    item.productBrand.length > 0 && item.productBrand[0],
                });
              }
            }}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E5E5',
            }}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={item => item.id.toString()}
    />
  );
}
