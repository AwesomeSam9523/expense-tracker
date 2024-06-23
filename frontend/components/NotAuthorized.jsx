import {Image, Text, View} from "react-native";
import icons from "../constants/icons";
import React from "react";

function NotAuthorized() {
  return (
    <View className="w-full h-full flex justify-center items-center px-4 bg-primary pt-[5%]">
      <View className="bg-secondary p-4 rounded-full ">
        <Image source={icons.unauthorized} className="w-32 h-32 m-4 " resizeMode="contain" />
      </View>
      <Text className="text-2xl font-bold text-white text-center pt-8">You are not authorized to view this page!</Text>
    </View>
  )
}

export default NotAuthorized;
