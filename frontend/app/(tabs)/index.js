import "../../global.css";
import {Image, StyleSheet, View, Text} from "react-native";
import icons from "../../constants/icons"
import React from "react";

export default function Index() {
  return (
    <View className=" flex-1 justify-center items-center ">
      <Text className="text-7xl font-bold " >IEEE CS</Text>
      <Image source={icons.one_zero} className="w-40 h-40" resizeMode="contain"/>
    </View>
  );
}
