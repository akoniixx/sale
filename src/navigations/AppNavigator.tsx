import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoadingNavigator from './LoadingNavigator';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './RootNavigator';
import Toast from 'react-native-toast-message';
import { useAuth } from '../contexts/AuthContext';
const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  React.useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        const typeNotification = remoteMessage?.data?.type;

        switch (typeNotification) {
          case 'ORDER':
            {
              const NavigationToHistoryDetail = async () => {
                await AsyncStorage.setItem('isFromNotification', 'true');
                navigationRef.current?.navigate('HistoryDetailScreen', {
                  orderId: remoteMessage?.data?.orderId,
                });
              };
              const checkConditionNavigate = async () => {
                const role = await AsyncStorage.getItem('role');
                const isSaleManager = role && role === 'SALE MANAGER';
                const isWaitApprove =
                  remoteMessage?.data &&
                  remoteMessage?.data?.status === 'WAIT_APPROVE_ORDER';
                if (isSaleManager && isWaitApprove) {
                  navigationRef.current?.navigate(
                    'SpecialRequestDetailScreen',
                    {
                      orderId: remoteMessage?.data?.orderId,
                    },
                  );
                } else {
                  NavigationToHistoryDetail();
                }
              };
              checkConditionNavigate();
            }
            break;
          case 'PROMOTION':
            {
              navigationRef.current?.navigate('NewsPromotionDetailScreen', {
                fromNoti: true,
                promotionId: remoteMessage?.data?.promotionId,
              });
            }
            break;
        }
      });
    messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const typeNotification = remoteMessage?.data?.type;
        switch (typeNotification) {
          case 'ORDER':
            {
              const NavigationToHistoryDetail = async () => {
                await AsyncStorage.setItem('isFromNotification', 'true');
                navigationRef.current?.navigate('HistoryDetailScreen', {
                  orderId: remoteMessage?.data?.orderId,
                });
              };
              const checkConditionNavigate = async () => {
                const role = await AsyncStorage.getItem('role');
                const isSaleManager = role && role === 'SALE MANAGER';
                const isWaitApprove =
                  remoteMessage?.data &&
                  remoteMessage?.data?.status === 'WAIT_APPROVE_ORDER';
                if (isSaleManager && isWaitApprove) {
                  navigationRef.current?.navigate(
                    'SpecialRequestDetailScreen',
                    {
                      orderId: remoteMessage?.data?.orderId,
                    },
                  );
                } else {
                  NavigationToHistoryDetail();
                }
              };
              checkConditionNavigate();
            }
            break;
          case 'PROMOTION':
            {
              navigationRef.current?.navigate('NewsPromotionDetailScreen', {
                fromNoti: true,
                promotionId: remoteMessage?.data?.promotionId,
              });
            }
            break;
        }
      },
    );
    messaging().onMessage(async remoteMessage => {
      const typeNotification = remoteMessage?.data?.type;

      switch (typeNotification) {
        case 'ORDER':
          {
            Toast.show({
              type: 'orderToast',
              text1: remoteMessage?.notification?.title,
              text2: remoteMessage?.notification?.body,
              onPress: async () => {
                const isWaitApprove =
                  remoteMessage?.data &&
                  remoteMessage?.data?.status === 'WAIT_APPROVE_ORDER';
                const role = await AsyncStorage.getItem('role');
                const isSaleManager = role && role === 'SALE MANAGER';

                if (isSaleManager && isWaitApprove) {
                  navigationRef.current?.navigate(
                    'SpecialRequestDetailScreen',
                    {
                      orderId: remoteMessage?.data?.orderId,
                    },
                  );
                } else {
                  navigationRef.current?.navigate('HistoryDetailScreen', {
                    orderId: remoteMessage?.data?.orderId,
                    isFromNotification: true,
                  });
                }
                Toast.hide();
              },
            });
          }
          break;
        case 'PROMOTION':
          {
            Toast.show({
              type: 'promotionToast',
              text1: remoteMessage?.notification?.title,
              text2: remoteMessage?.notification?.body,
              onPress: () => {
                navigationRef.current?.navigate('NewsPromotionDetailScreen', {
                  fromNoti: true,
                  promotionId: remoteMessage?.data?.promotionId,
                });
                Toast.hide();
              },
            });
          }
          break;
      }
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen
        name="initPage"
        component={LoadingNavigator}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
