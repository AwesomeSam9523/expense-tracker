import {Image, TouchableOpacity, View} from "react-native";
import icons from "../constants/icons";
import React from "react";
import {router} from "expo-router";
import ProfilePicture from "./ProfilePicture";

function TopHeader({userData}) {

  return (
    <View className="flex flex-row items-center justify-between w-full">
      <Image source={icons.cs} className="w-44 h-16" resizeMode="contain"/>
      <TouchableOpacity onPress={()=>{router.push("profile?id=" + userData.id)}} >
        <ProfilePicture size={"h-16 w-16"} user={{pfp: userData.pfp, id: userData.id}} token={userData.token} />
      </TouchableOpacity>
    </View>
  );
}

export default TopHeader;
