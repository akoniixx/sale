/* eslint-disable react/prop-types */
import { View, Text, Platform, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../assets/colors/colors';
import { useLocalization } from '../../contexts/LocalizationContext';
import icons from '../../assets/icons';
import HomeScreen from '../../screens/HomeScreen';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '.';
import HistoryScreen from '../../screens/HistoryScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import NotificationScreen from '../../screens/NotificationScreen';
const Tab = createBottomTabNavigator();
export default function MainTabBottomNavigator({
  route,
}: StackScreenProps<MainStackParamList, 'MainScreen'>) {
  const { t } = useLocalization();

  const ListTabs = [
    {
      name: 'home',
      title: t('tabs.HomeTab.title'),
      iconActive: icons.HomeActive,
      iconInactive: icons.HomeInActive,
      component: HomeScreen,
    },
    {
      name: 'history',
      title: t('tabs.HistoryTab.title'),
      iconActive: icons.HistoryActive,
      iconInactive: icons.HistoryInactive,
      component: HistoryScreen,
    },
    // {
    //   name: 'order',
    //   title: t('tabs.OrderTab.title'),
    //   iconActive: icons.OrderActive,
    //   iconInactive: icons.OrderInactive,
    //   component: View,
    // },
    {
      name: 'notification',
      title: t('tabs.NotificationTab.title'),
      iconActive: icons.NotificationActive,
      iconInactive: icons.NotificationInactive,
      component: NotificationScreen,
    },
    {
      name: 'profile',
      title: t('tabs.ProfileTab.title'),
      iconActive: icons.ProfileActive,
      iconInactive: icons.ProfileInactive,
      component: ProfileScreen,
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName={route.params?.screen ? route.params.screen : 'home'}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.06,
          shadowRadius: 1.62,
          elevation: 14,
        },
      }}>
      {ListTabs.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{
              tabBarLabelStyle: {
                fontFamily: 'Sarabun-Medium',
              },
              tabBarStyle: {
                minHeight: Platform.OS === 'ios' ? 95 : 80,
                alignItems: 'center',
                justifyContent: 'center',
              },
              tabBarButton(props) {
                const isFocused = props.accessibilityState?.selected;

                return (
                  <TouchableOpacity
                    {...props}
                    style={[
                      props.style,
                      {
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={isFocused ? item.iconActive : item.iconInactive}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        resizeMode="contain"
                      />

                      <Text
                        style={{
                          fontFamily: 'Sarabun-Medium',
                          fontSize: 10,
                          color: isFocused ? colors.primary : colors.text3,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}
