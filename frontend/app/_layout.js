import "../global.css"
import {SplashScreen, Stack} from 'expo-router';
import {useFonts} from 'expo-font'
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';


SplashScreen.preventAutoHideAsync();

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
      <StatusBar backgroundColor="#151515"/>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}}/>
        <Stack.Screen name='first-login' options={{headerShown:false}} />
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="profile" options={{headerShown: false}}/>
        
      </Stack>
    </>
  );
}
export default RootLayout;
