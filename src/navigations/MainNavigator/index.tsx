import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';
import SelectStoreScreen from '../../screens/SelectStoreScreen';
import StoreDetailScreen from '../../screens/StoreDetailScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';
import CartScreen from '../../screens/CartScreen';

export type MainStackParamList = {
  MainScreen: undefined;
  SelectStoreScreen: undefined;
  StoreDetailScreen: {
    id: string;
    name: string;
  };
  ProductDetailScreen: {
    id: string;
  };
  CartScreen: undefined;
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
        <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
        />
        <Stack.Screen name="CartScreen" component={CartScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
