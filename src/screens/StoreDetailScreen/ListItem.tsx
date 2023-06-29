import {
  View,
  FlatList,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import Item from './Item';
import ModalMessage from '../../components/Modal/ModalMessage';
import { ProductCategory, ProductType } from '../../entities/productType';
import { productServices } from '../../services/ProductServices';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  nameDealer: string;
  navigation: any;
  debounceSearchValue: any;
  productBrand?: {
    product_brand_id: string;
    product_brand_name: string;
    company: string;
  };
  setLoadingApi: (v: boolean) => void;
  loadingApi: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
export default function ListItem({
  nameDealer,
  navigation,
  debounceSearchValue,

  page,
  setPage,
  setLoadingApi,
}: Props): JSX.Element {
  const [type, setType] = React.useState<string>('all');
  const { t } = useLocalization();
  const [currentBrand, setCurrentBrand] = React.useState<string>('all');
  const [dataBrand, setDataBrand] = React.useState<ProductCategory[]>([]);
  const [isAddCart, setIsAddCart] = React.useState(false);
  const [isDelCart, setIsDelCart] = React.useState(false);
  const {
    state: { user },
  } = useAuth();

  const [data, setData] = React.useState<{
    count: number;
    data: ProductType[];
    count_location: [];
  }>({
    count: 0,
    data: [],
    count_location: [],
  });
  // console.log('data', JSON.stringify(data, null, 2));

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

  const getAllProduct = useCallback(async () => {
    try {
      setLoadingApi(true);
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const productB = await AsyncStorage.getItem('productBrand');

      const pB = JSON.parse(productB || '{}');
      const result = await productServices.getAllProducts({
        company: user?.company,
        page: 1,
        take: 10,
        searchText: debounceSearchValue,
        customerCompanyId: customerCompanyId || '',
        productBrandId: pB?.product_brand_id,
        isPromotion: type !== 'all',
        productCategoryId: currentBrand !== 'all' ? currentBrand : undefined,
      });

      setData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  }, [debounceSearchValue, user?.company, type, currentBrand, setLoadingApi]);
  const getMoreProduct = useCallback(async () => {
    try {
      if (data.count > data.data.length) {
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        const productB = await AsyncStorage.getItem('productBrand');
        const pB = JSON.parse(productB || '{}');
        const result = await productServices.getAllProducts({
          company: user?.company,
          customerId: user?.userStaffId,
          page: page + 1,
          take: 10,
          searchText: debounceSearchValue,
          productBrandId: pB?.product_brand_id,
          isPromotion: type !== 'all',
          customerCompanyId: customerCompanyId || '',

          productCategoryId: currentBrand !== 'all' ? currentBrand : undefined,
        });
        setData(prev => ({
          ...prev,
          data: [...prev.data, ...result.data],
        }));
        setPage(prev => prev + 1);
      } else {
        console.log('no more');
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    debounceSearchValue,
    user?.userStaffId,
    user?.company,

    type,
    page,
    data.data,
    data.count,
    currentBrand,
    setPage,
  ]);
  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

  const getProductCategory = useCallback(async () => {
    try {
      const result = await productServices.getProductCategory(user?.company);
      setDataBrand(result);
    } catch (error) {
      console.log(error);
    }
  }, [user?.company]);
  useFocusEffect(
    useCallback(() => {
      getProductCategory();
    }, [getProductCategory]),
  );

  const newDataBrand = useMemo(() => {
    return [
      {
        productCategoryId: 'all',
        company: user?.company,
        productCategoryImage: null,
        productCategoryName: 'all',
      },
      ...dataBrand,
    ];
  }, [dataBrand, user?.company]);
  const HeaderFlatList = React.useMemo(() => {
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
            <Text
              fontFamily="NotoSans"
              fontSize={18}
              color="white"
              bold
              numberOfLines={1}>
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
            padding: 16,
          }}>
          {dataBrand.length < 1 ? (
            <></>
          ) : (
            (newDataBrand || []).map((item, idx) => {
              const isLast = idx === newDataBrand.length - 1;
              if (!item?.productCategoryImage) {
                return (
                  <TouchableOpacity
                    key={item.productCategoryId}
                    style={[
                      styles({
                        isFocus: item.productCategoryId === currentBrand,
                      }).buttonBrand,
                      {
                        marginRight: isLast ? 32 : 8,
                      },
                    ]}
                    onPress={() => {
                      setCurrentBrand(item.productCategoryId);
                    }}>
                    <Text fontFamily="NotoSans" fontSize={14} semiBold>
                      {t('screens.StoreDetailScreen.allCategory')}
                    </Text>
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    {
                      marginRight: isLast ? 32 : 8,
                    },
                  ]}
                  onPress={() => {
                    setCurrentBrand(item?.productCategoryId);
                  }}>
                  <Image
                    source={{ uri: item?.productCategoryImage }}
                    style={{
                      width: 106,
                      height: 40,
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor:
                        currentBrand === item.productCategoryId
                          ? colors.text2
                          : colors.border1,
                    }}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    );
  }, [
    nameDealer,
    type,
    dataBrand,
    currentBrand,
    newDataBrand,
    t,
    setCurrentBrand,
    headerList,
  ]);

  const memorizeItem = useMemo(() => {
    const renderItem = ({
      item,
      index,
    }: {
      item: ProductType;
      index: number;
    }) => {
      const newItem = Object.assign({}, item || {});
      return (
        <>
          <Item
            {...newItem}
            index={index}
            idItem={item.productId}
            navigation={navigation}
            setIsAddCart={setIsAddCart}
            setIsDelCart={setIsDelCart}
          />
        </>
      );
    };

    return renderItem;
  }, [setIsAddCart, setIsDelCart, navigation]);

  return (
    <>
      <FlatList
        data={data?.data || []}
        numColumns={2}
        initialNumToRender={10}
        onEndReachedThreshold={0.7}
        onEndReached={() => {
          getMoreProduct();
        }}
        keyExtractor={(item, idx) => idx?.toString()}
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
        ListHeaderComponent={HeaderFlatList}
        renderItem={({ item, index }) =>
          memorizeItem({
            item,
            index,
          })
        }
      />
      <ModalMessage
        visible={isAddCart}
        message={t('modalMessage.addCart')}
        onRequestClose={() => setIsAddCart(false)}
      />
      <ModalMessage
        visible={isDelCart}
        message={t('modalMessage.deleteCart')}
        onRequestClose={() => setIsDelCart(false)}
      />
    </>
  );
}

const styles = ({ isFocus }: { isFocus: boolean }) =>
  StyleSheet.create({
    buttonBrand: {
      paddingVertical: 8,
      width: 88,
      height: 40,
      marginRight: 8,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      backgroundColor: isFocus ? colors.background1 : 'transparent',
      borderColor: isFocus ? colors.text2 : colors.border1,
    },
  });
