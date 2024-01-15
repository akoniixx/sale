import React, { useEffect } from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import MainTabBottomNavigator from './MainTabBottomNavigator';
import SelectStoreScreen from '../../screens/SelectStoreScreen';
import StoreDetailScreen from '../../screens/StoreDetailScreen';
import ProductDetailScreen from '../../screens/ProductDetailScreen';
import CartScreen from '../../screens/CartScreen';
import SelectBrandBeforeDetailScreen from '../../screens/SelectBrandBeforeDetailScreen';
import OrderSuccessScreen from '../../screens/OrderSuccessScreen';
import LoginSuccessScreen from '../../screens/LoginSuccessScreen';
import TermAndConditionScreen from '../../screens/TermAndConditionScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../RootNavigator';
import SpecialRequestScreen from '../../screens/SpecialRequestScreen';
import HistoryDetailScreen from '../../screens/HistoryDetailScreen';
import SettingNotificationScreen from '../../screens/SettingNotificationScreen';
import TCReadOnlyScreen from '../../screens/TCReadOnlyScreen';
import FreeSpeciaRequestScreen from '../../screens/SpecialRequestScreen/FreeSpeciaRequest';
import NewsPromotionDetailScreen from '../../screens/NewsPromotionScreen/NewsPromotionDetailScreen';
import NewsScreen from '../../screens/NewsScreen';
import NewsDetailScreen from '../../screens/NewsScreen/NewsDetailScreen';
import UploadFileScreen from '../../screens/UploadFileScreen/UploadFileScreen';
import EditFileScreen from '../../screens/HistoryDetailScreen/EditFilescreen';
import { HistoryDataType, orderFiles } from '../../entities/historyTypes';

export type MainStackParamList = {
  MainScreen: {
    screen?: string;
  };

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
  CartScreen: {
    step?: number;
    specialRequestRemark?: string | undefined;
    isReorder?:boolean
  };
  OrderSuccessScreen: {
    orderId: string;
  };
  TermAndConditionScreen: undefined;
  LoginSuccessScreen: undefined;
  SpecialRequestScreen: {
    specialRequestRemark: string | undefined;
  };
  HistoryScreen: undefined;
  HistoryDetailScreen: {
    orderId: string;
    headerTitle: string;
  };
  TCReadOnlyScreen: undefined;
  SettingNotificationScreen: undefined;
  FreeSpeciaRequestScreen: undefined
  NewsPromotionDetailScreen: {
    data?:NewsPromotion[]
    fromNoti?:boolean
    promotionId?:string
  }
  NewsScreen: undefined;
  NewsDetailScreen:{
    newsId:string
  }
  UploadFileScreen:{
    orderId:string
  }
  EditFileScreen:{
    orderId:string
  }
  
};
const Stack = createStackNavigator<MainStackParamList>();
export default function MainNavigator() {
  useEffect(() => {
    const getAlreadyAcceptTerm = async () => {
     
      const isFromNotification = await AsyncStorage.getItem(
        'isFromNotification',
      );
     
        if (isFromNotification === 'true') {
          return await AsyncStorage.removeItem('isFromNotification');
        }
        navigate('MainScreen');
      
    };
    getAlreadyAcceptTerm();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}>
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
        <Stack.Screen
          name="SpecialRequestScreen"
          component={SpecialRequestScreen}
        />
         <Stack.Screen
          name="FreeSpeciaRequestScreen"
          component={FreeSpeciaRequestScreen}
        />
        <Stack.Screen
          name="HistoryDetailScreen"
          component={HistoryDetailScreen}
        />
      </Stack.Group>
      <Stack.Screen
        name="SettingNotificationScreen"
        component={SettingNotificationScreen}
      />
      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
      />
      <Stack.Screen name="TCReadOnlyScreen" component={TCReadOnlyScreen} />
      <Stack.Screen name="NewsPromotionDetailScreen" component={NewsPromotionDetailScreen} />
      <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
      <Stack.Screen name='UploadFileScreen' component={UploadFileScreen} />
      <Stack.Screen name='EditFileScreen' component={EditFileScreen} />
      
      
    </Stack.Navigator>
  );
}
