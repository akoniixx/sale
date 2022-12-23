import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';
import SelectStoreScreen from '../../screens/SelectStoreScreen';
import StoreDetailScreen from '../../screens/StoreDetailScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';
import CartScreen from '../../screens/CartScreen';
import SelectBrandBeforeDetailScreen from '../../screens/SelectBrandBeforeDetailScreen';
import OrderSuccessScreen from '../../screens/OrderSuccessScreen';
import LoginSuccessScreen from '../../screens/LoginSuccessScreen';
import TermAndConditionScreen from '../../screens/TermAndConditionScreen';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../RootNavigator';

export type MainStackParamList = {
  MainScreen: undefined;

  SelectStoreScreen: undefined;
  StoreDetailScreen: {
    id?: string;
    name: string;
    productBrand?: {
      product_brand_id: string;
      product_brand_name: string;
      company: string;
    };
  };
  SelectBrandBeforeDetailScreen: {
    id: string;
    name: string;
    productBrand: {
      company: string;
      product_brand_id: string;
      product_brand_name: string;
      product_brand_logo: string;
    }[];
    customerCompanyId: string;
  };
  ProductDetailScreen: {
    id: string;
    customerCompanyId: string;
  };
  CartScreen: undefined;
  OrderSuccessScreen: {
    orderId: string;
  };
  TermAndConditionScreen: undefined;
  LoginSuccessScreen: undefined;
};
const Stack = createStackNavigator<MainStackParamList>();
export default function MainNavigator() {
  useEffect(() => {
    const getAlreadyAcceptTerm = async () => {
      const alreadyAcceptTerm = await AsyncStorage.getItem('alreadyAcceptTerm');
      if (alreadyAcceptTerm === null) {
        navigate('TermAndConditionScreen');
      } else {
        navigate('MainScreen');
      }
    };
    getAlreadyAcceptTerm();
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen
          name="MainScreen"
          component={MainTabBottomNavigator}
          options={{
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen name="SelectStoreScreen" component={SelectStoreScreen} />
        <Stack.Screen
          name="SelectBrandBeforeDetailScreen"
          component={SelectBrandBeforeDetailScreen}
        />
        <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
        />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen
          name="OrderSuccessScreen"
          component={OrderSuccessScreen}
        />
        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
        <Stack.Screen
          name="TermAndConditionScreen"
          component={TermAndConditionScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
