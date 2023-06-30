import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../assets/colors/colors';

interface Props {
  data: {
    isActive: boolean;
    id: string;
    name: string;
    customerNo: string;
    moreThanOneBrand: boolean;
    customerCompanyId: string;
    termPayment: string;
    address: {
      addressText: string;
      name: string;
    };
    productBrand: {
      product_brand_id: string;
      product_brand_name: string;
      company: string;
    }[];
    userShopId: string;
  }[];
  searchValue?: string | undefined;
  navigation: StackNavigationHelpers;
}
export default function ListSearchResult({
  data,
  navigation,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();
  const { setItem } = useAsyncStorage('customerCompanyId');
  const { setItem: setTermPayment } = useAsyncStorage('termPayment');
  const { setItem: setCustomerNo } = useAsyncStorage('customerNo');
  const { setItem: setCustomerName } = useAsyncStorage('customerName');
  const { setItem: setProductBrand } = useAsyncStorage('productBrand');
  const { setItem: setAddress } = useAsyncStorage('address');

  const { setItem: setUserShopId } = useAsyncStorage('userShopId');
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
        const isBlock = !item.isActive && user?.company === 'ICPL';
        return (
          <TouchableOpacity
            disabled={isBlock}
            onPress={() => {
              setItem(item.customerCompanyId);
              setTermPayment(item.termPayment);
              setCustomerNo(item.customerNo);
              setCustomerName(item.name);
              setProductBrand(JSON.stringify(item.productBrand));
              setAddress(JSON.stringify(item.address));
              if (item.userShopId) {
                setUserShopId(item.userShopId);
              }
              if (item.moreThanOneBrand) {
                navigation.navigate('SelectBrandBeforeDetailScreen', {
                  id: item.id,
                  name: item.name,
                  productBrand: item.productBrand,
                });
              } else {
                setProductBrand(JSON.stringify(item.productBrand[0]));
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
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: isBlock ? 0.8 : 1,
              }}
              lineHeight={36}
              color={isBlock ? 'text3' : 'text1'}>
              {item.name}
            </Text>
            {isBlock && (
              <View
                style={{
                  flex: 0.2,
                  padding: 2,
                  borderRadius: 8,
                  backgroundColor: colors.background2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text fontFamily="NotoSans">ปิดใช้งาน</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      }}
      keyExtractor={item => item.id.toString()}
    />
  );
}
