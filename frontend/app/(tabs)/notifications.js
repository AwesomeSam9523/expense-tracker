import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import TopHeader from "../../components/TopHeader";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="w-full h-full flex justify-start items-center px-4 bg-primary pt-[5%]">
        <TopHeader />
      </View>
    </SafeAreaView>
  );
}
