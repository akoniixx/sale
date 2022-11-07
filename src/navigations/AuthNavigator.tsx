import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginSuccessScreen from '../screens/LoginSuccessScreen';

type AuthStackParamList = {
  LoginScreen: undefined;
  OtpScreen: undefined;
  WelcomeScreen: undefined;
  LoginSuccessScreen: undefined;
};
const Stack = createStackNavigator<AuthStackParamList>();
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LoginScreen">
      <Stack.Group>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
