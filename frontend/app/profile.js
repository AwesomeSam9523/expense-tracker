import { View, Image, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {getUserData, setToken} from "../utils/userdata";
import { router } from "expo-router";
import ProfileButton from "../components/ProfileButton";
import icons from "../constants/icons";

const Profile = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getUserData().then((data) => {
      setUserData(data);
    });
  }, []);

  const logout = async () => {
    await setUserData({});
    await setToken('');
    router.replace("/");
  }
  return (
    <SafeAreaView className="flex-1">
      <View className="flex justify-start bg-primary w-full h-full">
        <View className="relative w-full h-[56%]">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
          >
            <View className="bg-darkgray p-2 rounded-full">
              <Image
                source={icons.leftArrow}
                className="w-8 h-8 rounded-full"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <Image
            className="w-full h-full"
            resizeMode="cover"
            source={{ uri: userData.pfp }}
          />
          <LinearGradient
            colors={["transparent", "rgb(21,21,21)"]}
            className="absolute w-full h-[15%] bottom-0"
          />
        </View>
        <View className="mx-8 my-5">
          <View className="flex flex-row items-center">
            <Text className="text-white font-extrabold text-4xl">
              {userData.name}
            </Text>
            <View className="border-2 rounded-full px-3 py-1 mx-2 border-secondary">
              <Text className="text-secondary font-bold">{userData.role}</Text>
            </View>
          </View>
          <View className="flex justify-center items-center mt-8">
            <ProfileButton
              icon={icons.profile_password}
              value="Change Password"
            />
            <ProfileButton icon={icons.invoice} value="My Invoices" />
            <ProfileButton icon={icons.logOut} value="Logout" handlePress={logout}/>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
