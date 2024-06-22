import {Image, TouchableOpacity, View} from "react-native";
import icons from "../constants/icons";
import React, {useEffect, useState} from "react";
import {getUserData, setToken} from "../utils/userdata";
import {router} from "expo-router";

function TopHeader() {

  const [userData, setUserData] = useState({});

  useEffect(() => {
    getUserData().then(setUserData);
  }, []);

  const logout = async () => {
    await setUserData({});
    await setToken('');
    router.replace("/");
  }

  return (
    <View className="flex flex-row items-center justify-between w-full">
      <Image source={icons.cs} className="w-44 h-16" resizeMode="contain"/>
      <TouchableOpacity onPress={logout}>
        {userData.pfp
          ? <Image source={{uri: userData.pfp}} className="w-16 h-16 rounded-full" resizeMode="cover" />
          : <Image source={icons.userIcon} className="w-16 h-16 rounded-full" resizeMode="contain" />}
      </TouchableOpacity>
    </View>
  );
}

export default TopHeader;
