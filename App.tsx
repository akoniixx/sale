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
import { Alert, Linking, Platform } from 'react-native';
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/components/Sheet/sheets.tsx';
import VersionCheck from 'react-native-version-check';
import storeVersion from 'react-native-store-version';
import RNExitApp from 'react-native-kill-app';
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
          onPress: () => {
            if (isIOS) {
              Linking.openURL(storeUrl);
            } else {
              Linking.openURL(playStoreUrl);
            }
            RNExitApp.exitApp();
          },
        },
      ]);
    }
  };
  React.useEffect(() => {
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
  }, []);

  React.useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        const typeNotification = remoteMessage?.data?.type;

        switch (typeNotification) {
          case 'ORDER': {
            navigationRef.current?.navigate('HistoryDetailScreen', {
              orderId: remoteMessage?.data?.orderId,
            });
          }
        }
      });
    messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const typeNotification = remoteMessage?.data?.type;
        switch (typeNotification) {
          case 'ORDER': {
            navigationRef.current?.navigate('HistoryDetailScreen', {
              orderId: remoteMessage?.data?.orderId,
            });
          }
        }
      },
    );
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    checkVersion();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
    </NavigationContainer>
  );
};

export default App;
