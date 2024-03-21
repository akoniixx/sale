import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SheetProvider } from 'react-native-actions-sheet';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigations/AppNavigator';
import { navigationRef } from './src/navigations/RootNavigator';
import Toast from 'react-native-toast-message';
import { LocalizationProvider } from './src/contexts/LocalizationContext';
import { toastConfig } from './src/Toast/ToastConfig';
import { CartProvider } from './src/contexts/CartContext';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import SplashScreen from 'react-native-splash-screen';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionCheck from 'react-native-version-check';
import './src/components/Sheet/sheets.tsx';
import storeVersion from 'react-native-store-version';
import RNExitApp from 'react-native-kill-app';
import analytics from '@react-native-firebase/analytics';
import {
  PERMISSIONS,
  checkNotifications,
  request,
} from 'react-native-permissions';
import { NetworkProvider } from './src/contexts/NetworkContext';

import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

dayjs.extend(buddhaEra);
const App = () => {
  const checkVersion = async () => {
    const isIOS = Platform.OS === 'ios';
    const currentVersion = VersionCheck.getCurrentVersion();
    const storeUrl = await VersionCheck.getAppStoreUrl({
      appID: '6450045082',
    });
    const getPackage = await VersionCheck.getPackageName();

    const playStoreUrl = await VersionCheck.getPlayStoreUrl({
      packageName: getPackage,
    });

    const { remote } = await storeVersion({
      version: currentVersion,
      androidStoreURL: playStoreUrl,
      iosStoreURL: storeUrl,
      country: 'TH',
    });
    const needUpdate = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion: remote,
    });

    if (needUpdate.isNeeded) {
      Alert.alert('มีการอัพเดทใหม่', undefined, [
        {
          text: 'อัพเดท',
          onPress: async () => {
            if (isIOS) {
              await Linking.openURL(storeUrl);
            } else {
              await Linking.openURL(playStoreUrl);
            }
            RNExitApp.exitApp();
          },
        },
      ]);
    }
  };

  React.useEffect(() => {
    const checkPermission = () => {
      checkNotifications().then(async ({ status }) => {
        if (status === 'denied' || status === 'blocked') {
          if (Platform.OS === 'android' && Platform.Version >= 33) {
            request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          }
          requestUserPermission();
        }
      });
    };

    request('ios.permission.APP_TRACKING_TRANSPARENCY');
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }

    const getTestFirebaseToken = async () => {
      const firebaseToken = await AsyncStorage.getItem('fcmtoken');
      console.log('firebaseToken', firebaseToken);
    };
    requestUserPermission();
    getTestFirebaseToken();
    checkVersion();
    checkPermission();
  }, []);

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
              NavigationToHistoryDetail();
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
              NavigationToHistoryDetail();
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
              onPress: () => {
                navigationRef.current?.navigate('HistoryDetailScreen', {
                  orderId: remoteMessage?.data?.orderId,
                  isFromNotification: true,
                });
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
    <NavigationContainer ref={navigationRef}>
      <NetworkProvider>
        <AutocompleteDropdownContextProvider>
          <LocalizationProvider>
            <AuthProvider>
              <CartProvider>
                <SheetProvider>
                  <AppNavigator />
                </SheetProvider>
              </CartProvider>
            </AuthProvider>
          </LocalizationProvider>
          <Toast config={toastConfig} />
        </AutocompleteDropdownContextProvider>
      </NetworkProvider>
    </NavigationContainer>
  );
};

export default App;
