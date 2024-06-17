import "../global.css"
import {SplashScreen, Stack} from 'expo-router';
import {useFonts} from 'expo-font'
import React, {useEffect} from 'react';
import {Image, StatusBar} from 'react-native';
import HomeScreen from "@/app/home";
import UserManagementScreen from "@/app/userManagement";
import PendingInvoicesScreen from "@/app/pendingInvoice";
import NotificationsScreen from "@/app/notifications";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import icons from "@/constants/icons";

SplashScreen.preventAutoHideAsync();
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
  home: icons.home,
  userManagement: icons.profile,
  pendingInvoice: icons.tray_invoice,
  notifications: icons.notification,
}

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Barlow-ExtraBold": require("../assets/fonts/Barlow-ExtraBold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),

  })

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null


  return (
    <>
      <Tab.Navigator
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
        <Tab.Screen name="home" component={HomeScreen} options={{tabBarLabel: 'Home'}} />
        <Tab.Screen name="userManagement" component={UserManagementScreen} options={{tabBarLabel: 'Manage Users'}}/>
        <Tab.Screen name="pendingInvoice" component={PendingInvoicesScreen} options={{tabBarLabel: 'Pending Invoices'}}/>
        <Tab.Screen name="notifications" component={NotificationsScreen} options={{tabBarLabel: 'Notifications'}}/>
      </Tab.Navigator>
      <StatusBar backgroundColor="#151515"/>
    </>

  );
}
export default RootLayout;
