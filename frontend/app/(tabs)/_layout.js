import { Image, StatusBar, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "../../constants/icons"; 

const TabBarIcon = ({ icon, focused }) => (
  <View
    style={{
      backgroundColor: focused ? "#f5b301" : "transparent",
      borderRadius: 30,
      padding: 15,
    }}
  >
    <Image
      source={icon}
      style={{
        width: 24,
        height: 24,
        tintColor: focused ? "#262626" : "#ffffff",
        resizeMode: "contain", 
      }}
    />
  </View>
);

const routeIcons = {
  index: icons.home,
  userManagement: icons.profile,
  pendingInvoice: icons.tray_invoice,
  notifications: icons.notification,
};

export default function TabLayout() {
  return (
    <>
      
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            return (
              <TabBarIcon icon={routeIcons[route.name]} focused={focused} />
            );
          },
          tabBarActiveTintColor: "#f5b301",
          tabBarInactiveTintColor: "#ffffff",
          tabBarStyle: {
            backgroundColor: "#262626",
            paddingBottom: 5,
            height: 80,
            paddingHorizontal: 20,
          },
          tabBarShowLabel: false,
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
        <Tabs.Screen
          name="userManagement"
          options={{ tabBarLabel: "Manage Users" }}
        />
        <Tabs.Screen
          name="pendingInvoice"
          options={{ tabBarLabel: "Pending Invoices" }}
        />
        <Tabs.Screen
          name="notifications"
          options={{ tabBarLabel: "Notifications" }}
        />
        
      </Tabs>
      <StatusBar backgroundColor="#151515" />
    </>
  );
}
