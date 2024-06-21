import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopHeader from "../../components/TopHeader";
import NotificationCard from "../../components/NotificationCard";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="w-full h-full  px-4 bg-primary pt-[5%]">
        <View className="flex justify-start items-center">
          <TopHeader />
        </View>
        <View className="flex items-center  ">
          <Text className=" text-4xl text-white  font-bold pt-[8%]">
            Notifications
          </Text>
          <View className="my-16 w-full">
          <NotificationCard accepted={false} invoiceId={"#0000"} event={"Hackerzstreet"} />
          <NotificationCard accepted={true} invoiceId={"#0001"} event={"Weakestlink"} />
        </View>
        </View>

        
      </View>
    </SafeAreaView>
  );
}
