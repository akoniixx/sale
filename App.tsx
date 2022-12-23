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

import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import SplashScreen from 'react-native-splash-screen';
import { Platform } from 'react-native';
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
dayjs.extend(buddhaEra);
const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    requestUserPermission();
    const getTestFirebaseToken = async () => {
      const firebaseToken = await AsyncStorage.getItem('fcmtoken');
      console.log('firebaseToken', firebaseToken);
    };
    getTestFirebaseToken();
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
