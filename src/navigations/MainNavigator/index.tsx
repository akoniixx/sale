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
import { HistoryDataType } from '../../entities/historyTypes';
import CancelOrderScreen from '../../screens/CancelOrderScreen';
import CancelOrderSuccessScreen from '../../screens/CancelOrderSuccessScreen';
import SpecialRequestApproveScreen from '../../screens/SpecialRequestApproveScreen';
import SpecialRequestDetailScreen from '../../screens/SpecialRequestDetailScreen';
import dayjs from 'dayjs';
import EditOrderLoadsScreen from '../../screens/HistoryDetailScreen/EditOrderLoadScreen';
import SelectLocationScreen from '../../screens/SelectLocationScreen';
import AddLocationScreen from '../../screens/AddLocationScreen';
import EditLocationScreen from '../../screens/EditLocationScreen';
import DeliveryFilesScreen from '../../screens/DeliveryFilesScreen';

export type LocationDataType = {
  comment?: string;
  selected?: string;
  name?: string;
  address?: string;
  id?: string;
};

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
    isReorder?: boolean;
    locationData?: LocationDataType;
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
  FreeSpeciaRequestScreen: undefined;
  NewsPromotionDetailScreen: {
    data?: NewsPromotion[];
    fromNoti?: boolean;
    promotionId?: string;
  };
  NewsScreen: undefined;
  NewsDetailScreen: {
    newsId: string;
  };
  UploadFileScreen: {
    orderId: string;
  };
  EditFileScreen: {
    orderId: string;
  };
  CancelOrderScreen: {
    orderId: string;
    orderProducts: {
      baseUom: string;
      commonName: string;
      marketPrice: number;
      isFreebie: boolean;

      orderId: string;
      orderProductId: string;
      packSize: string;
      packingUom: string;
      productCodeNav: string;
      productId: number;
      productName: string;
      productImage: string | null;
      qtySaleUnit: number;
      quantity: number;
      saleUOM: string;
      saleUOMTH: string;
      shipmentOrder: number;
      totalPrice: number;
    }[];
    paidStatus: string;
    soNo: string | null;
    navNo: string | null;
    orderNo: string;
    status: 'WAIT_APPROVE_ORDER' | 'WAIT_CONFIRM_ORDER' | 'CONFIRM_ORDER';
  };
  CancelOrderSuccessScreen: {
    updateAt: string;
    orderId: string;
    cancelRemark: string;
    orderProducts: {
      baseUom: string;
      commonName: string;
      marketPrice: number;
      orderId: string;
      orderProductId: string;
      packSize: string;
      packingUom: string;
      productCodeNav: string;
      productId: number;
      productName: string;
      productImage: string | null;
      qtySaleUnit: number;
      quantity: number;
      saleUOM: string;
      saleUOMTH: string;
      shipmentOrder: number;
      totalPrice: number;
      isFreebie: boolean;
    }[];
    paidStatus: string;
    soNo: string | null;
    navNo: string | null;
    orderNo: string;
  };
  SpecialRequestApproveScreen: {
    backTime?: number;
  };
  SpecialRequestDetailScreen: {
    date: string;
    orderId: string;
    navigationFrom?: 'NotificationScreen' | 'SpecialRequestScreen';
  };
  EditOrderLoadsScreen: {
    orderDetail: HistoryDataType;
  };
  SelectLocationScreen: LocationDataType;
  AddLocationScreen: undefined;
  EditLocationScreen: {
    customerOtherId: string;
  };
  DeliveryFilesScreen: {
    deliveryFiles: string[];
  };
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
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="TCReadOnlyScreen" component={TCReadOnlyScreen} />
      <Stack.Screen
        name="NewsPromotionDetailScreen"
        component={NewsPromotionDetailScreen}
      />
      <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
      <Stack.Screen name="UploadFileScreen" component={UploadFileScreen} />
      <Stack.Screen name="EditFileScreen" component={EditFileScreen} />
      <Stack.Screen name="CancelOrderScreen" component={CancelOrderScreen} />
      <Stack.Screen
        name="CancelOrderSuccessScreen"
        component={CancelOrderSuccessScreen}
      />
      <Stack.Screen
        name="EditOrderLoadsScreen"
        component={EditOrderLoadsScreen}
      />
      <Stack.Screen
        name="SpecialRequestApproveScreen"
        component={SpecialRequestApproveScreen}
        initialParams={{ backTime: dayjs().unix() }}
      />
      <Stack.Screen
        name="SpecialRequestDetailScreen"
        component={SpecialRequestDetailScreen}
        initialParams={{
          navigationFrom: 'SpecialRequestScreen',
        }}
      />
      <Stack.Screen
        name="SelectLocationScreen"
        component={SelectLocationScreen}
        initialParams={{
          comment: '',
          selected: 'SHOP',
          name: '',
        }}
      />
      <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
      <Stack.Screen name="EditLocationScreen" component={EditLocationScreen} />
      <Stack.Screen
        initialParams={{ deliveryFiles: [] }}
        name="DeliveryFilesScreen"
        component={DeliveryFilesScreen}
      />
    </Stack.Navigator>
  );
}
