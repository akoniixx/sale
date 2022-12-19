import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';
import SelectStoreScreen from '../../screens/SelectStoreScreen';
import StoreDetailScreen from '../../screens/StoreDetailScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';
import CartScreen from '../../screens/CartScreen';
import SelectBrandBeforeDetailScreen from '../../screens/SelectBrandBeforeDetailScreen';
import OrderSuccessScreen from '../../screens/OrderSuccessScreen';

export type MainStackParamList = {
  MainScreen: undefined;

  SelectStoreScreen: undefined;
  StoreDetailScreen: {
    id: string;
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
};
const Stack = createStackNavigator<MainStackParamList>();
export default function MainNavigator() {
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
      </Stack.Group>
    </Stack.Navigator>
  );
}
