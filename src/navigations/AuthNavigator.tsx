import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthStackParamList = {
  LoginScreen: undefined;
  OtpScreen: {
    token: string;
    refCode: string;
    tel: string;
  };
  WelcomeScreen: undefined;
};
const Stack = createStackNavigator<AuthStackParamList>();
export default function AuthNavigator() {
  const [isFirstOpenApp, setIsFirstOpenApp] = React.useState<boolean | null>(
    null,
  );

  useFocusEffect(
    React.useCallback(() => {
      const getIsFirstOpenApp = async () => {
        const firstOpenApp = await AsyncStorage.getItem('firstOpenApp');
        if (firstOpenApp === null) {
          setIsFirstOpenApp(null);
        } else {
          setIsFirstOpenApp(false);
        }
      };
      getIsFirstOpenApp();
    }, []),
  );
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isFirstOpenApp ? 'WelcomeScreen' : 'LoginScreen'}>
      <Stack.Group>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
