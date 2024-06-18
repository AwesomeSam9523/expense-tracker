import {Image, StatusBar} from "react-native";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import icons from "../../constants/icons";
import { Tabs } from 'expo-router';

const Tab = createBottomTabNavigator();
const TabBarIcon = (props) => (
  <Image
    source={props.icon}
    style={{
      width: 24,
      height: 24,
      tintColor: props.focused ? '#f5b301' : '#ffffff',
    }}
  />
);

const routeIcons = {
  index: icons.home,
  userManagement: icons.profile,
  pendingInvoice: icons.tray_invoice,
  notifications: icons.notification,
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={({route}) => ({
          tabBarIcon: ({ focused, color, size }) => {
            return <TabBarIcon icon={routeIcons[route.name]} focused={focused}/>;
          },
          tabBarActiveTintColor: '#f5b301',
          tabBarInactiveTintColor: '#ffffff',
          tabBarStyle: {
            backgroundColor: '#000000',
            paddingBottom: 5,
            height: 55,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false
        })}
      >
        <Tabs.Screen name="index" options={{tabBarLabel: 'Home'}} />
        <Tabs.Screen name="userManagement" options={{tabBarLabel: 'Manage Users'}}/>
        <Tabs.Screen name="pendingInvoice" options={{tabBarLabel: 'Pending Invoices'}}/>
        <Tabs.Screen name="notifications" options={{tabBarLabel: 'Notifications'}}/>
      </Tabs>
      <StatusBar backgroundColor="#151515"/>
    </>
  )
}
