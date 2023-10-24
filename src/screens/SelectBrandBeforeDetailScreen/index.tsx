import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import { useLocalization } from '../../contexts/LocalizationContext';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function SelectBrandBeforeDetailScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SelectBrandBeforeDetailScreen'>) {
  const { id, name: nameCompany, productBrand } = route.params;
  const { t } = useLocalization();
  const { setItem: setProductBrand } = useAsyncStorage('productBrand');
  

  return (
    <Container>
      <Header title={t('screens.SelectBrandBeforeDetailScreen.title')} />
      <Content
        style={{
          backgroundColor: colors.background1,
          padding: 0,
        }}>
        <ScrollView style={styled().list}>
          {productBrand.map(item => {
            return (
              <View
                key={item.product_brand_id}
                style={[styled().item, styled().itemShadow]}>
                <TouchableOpacity
                  style={styled().item}
                  onPress={() => {
                    setProductBrand(
                      JSON.stringify({
                        product_brand_id: item.product_brand_id,
                        product_brand_name: item.product_brand_name,
                        company: item.company,
                      }),
                    );
                    navigation.navigate('StoreDetailScreen', {
                      id,
                      name: nameCompany,
                      productBrand: {
                        product_brand_id: item.product_brand_id,
                        product_brand_name: item.product_brand_name,
                        company: item.company,
                      },
                    });
                  }}>
                  <View style={styled().row}>
                    <Image
                      source={{ uri: item.product_brand_logo }}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 16,
                      }}
                    />
                    <Text>{item.product_brand_name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </Content>
    </Container>
  );
}
const styled = () =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingLeft: 16,
      alignItems: 'center',
    },
    list: {
      flex: 1,
      marginTop: 16,
    },
    item: {
      borderRadius: 12,
      paddingVertical: 8,
      backgroundColor: colors.white,
      flex: 1,
      justifyContent: 'center',
    },
    itemShadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      height: 88,
      marginHorizontal: 16,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 12,
      marginVertical: 8,
    },
  });
