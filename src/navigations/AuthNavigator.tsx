import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './RootNavigator';

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
  useFocusEffect(
    React.useCallback(() => {
      const getIsFirstOpenApp = async () => {
        const firstOpenApp = await AsyncStorage.getItem('firstOpenApp');
        if (firstOpenApp === null) {
          navigate('WelcomeScreen');
        } else {
          navigate('LoginScreen');
        }
      };
      getIsFirstOpenApp();
    }, []),
  );
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'LoginScreen'}>
      <Stack.Group>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
