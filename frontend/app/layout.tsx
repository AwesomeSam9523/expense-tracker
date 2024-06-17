import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet, ImageSourcePropType } from 'react-native';
import HomeScreen from './home.tsx';
import UserManagementScreen from './user.tsx';
import PendingInvoicesScreen from './pendinginvoice.tsx';
import NotificationsScreen from './notifs.tsx';

const Tab = createBottomTabNavigator();

const TabBarIcon = (props: { icon: ImageSourcePropType | undefined; focused: any; }) => (
  <Image
    source={props.icon}
    style={{
      width: 24,
      height: 24,
      tintColor: props.focused ? '#f5b301' : '#ffffff',
    }}
  />
);

export default function RootLayout() {
 
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = require('../assets/icons/home.png');
            } else if (route.name === 'User Management') {
              iconName = require('../assets/icons/profile.png');
            } else if (route.name === 'Pending Invoices') {
              iconName = require('../assets/icons/tray-invoice.png');
            } else if (route.name === 'Notifications') {
              iconName = require('../assets/icons/notification.png');
            }
            return <TabBarIcon icon={iconName} focused={focused} />;
          },
          tabBarActiveTintColor: '#f5b301',
          tabBarInactiveTintColor: '#ffffff',
          tabBarStyle: {
            backgroundColor: '#000000',
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="user" component={UserManagementScreen} />
        <Tab.Screen name="pendinginvoice" component={PendingInvoicesScreen} />
        <Tab.Screen name="notifs" component={NotificationsScreen} />
      </Tab.Navigator>
    /* <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack></>  */
  );
}
