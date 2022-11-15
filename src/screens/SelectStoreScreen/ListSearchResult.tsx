import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';

interface Props {
  data: {
    id: string;
    name: string;
    customerNo: string;
  }[];
  searchValue?: string | undefined;
  navigation: StackNavigationHelpers;
}
export default function ListSearchResult({
  data,
  navigation,
}: Props): JSX.Element {
  const { t } = useLocalization();
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
              navigation.navigate('StoreDetailScreen', {
                id: item.id,
                name: item.name,
              });
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
