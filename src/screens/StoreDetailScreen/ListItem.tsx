import {
  View,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useMemo } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Item from './Item';

interface Props {
  data: [];
  nameDealer: string;
}
export default function ListItem({ data, nameDealer }: Props): JSX.Element {
  const [type, setType] = React.useState<string>('all');
  const { t } = useLocalization();
  const [brand, setBrand] = React.useState<string>('all');
  const mockData = useMemo(() => {
    const data = [];
    const brand = [];
    for (let i = 0; i < 20; i++) {
      data.push(i);
      brand.push({
        id: i,
        name: 'แบรนด์ ' + i + 1,
      });
    }
    return {
      data,
      brand,
    };
  }, []);
  const headerList = [
    {
      id: 'all',
      title: t('screens.StoreDetailScreen.allItems'),
    },
    {
      id: 'promotion',
      title: t('screens.StoreDetailScreen.promotion'),
    },
  ];
  const HeaderFlatList = () => {
    return (
      <View
        style={{
          paddingBottom: 16,
        }}>
        <ImageBackground
          source={images.BGStoreDetailScreen}
          style={{
            width: '100%',
            height: 160,
            marginTop: 8,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              paddingTop: 24,
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text fontFamily="NotoSans" fontSize={18} color="white" bold>
              {nameDealer}
            </Text>
            <Image
              source={images.noImageStore}
              style={{
                width: 62,
                height: 62,
              }}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: colors.background3,
                height: 46,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: colors.background3,
              }}>
              {headerList.map(item => {
                return (
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderRadius: 6,
                      backgroundColor:
                        type === item.id ? 'white' : 'transparent',
                    }}
                    key={item.id}
                    onPress={() => {
                      setType(item.id);
                    }}>
                    <Text fontFamily="NotoSans" semiBold>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ImageBackground>
        <View
          style={{
            padding: 16,
          }}>
          <Text fontFamily="NotoSans" bold fontSize={18}>
            {t(
              type === 'all'
                ? 'screens.StoreDetailScreen.allItems'
                : 'screens.StoreDetailScreen.promotionAll',
            )}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingLeft: 16,
          }}>
          {mockData.brand.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles({ isFocus: item.name === brand }).buttonBrand}
                onPress={() => {
                  setBrand(item.name);
                }}>
                <Text fontFamily="NotoSans" fontSize={14} semiBold>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <FlatList
      data={mockData.data}
      numColumns={2}
      columnWrapperStyle={{
        paddingHorizontal: 16,
        justifyContent: 'space-between',
      }}
      ListEmptyComponent={() => {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}>
            <Image
              source={images.emptyProduct}
              style={{
                width: 90,
                height: 90,
              }}
            />
            <Text
              color="text3"
              fontFamily="NotoSans"
              style={{
                marginTop: 16,
              }}>
              {t('screens.StoreDetailScreen.empty')}
            </Text>
          </View>
        );
      }}
      ListHeaderComponent={<HeaderFlatList />}
      renderItem={({ item, index }) => <Item index={index} />}
    />
  );
}

const styles = ({ isFocus }: { isFocus: boolean }) =>
  StyleSheet.create({
    buttonBrand: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 8,
      borderRadius: 6,
      borderWidth: 1,
      backgroundColor: isFocus ? colors.background1 : 'transparent',
      borderColor: isFocus ? colors.text2 : colors.border1,
    },
  });
