import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';

interface Props {
  data: {
    id: number;
    name: string;
  }[];
  searchValue: string | undefined;
}
export default function ListSearchResult({
  data,
  searchValue,
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
