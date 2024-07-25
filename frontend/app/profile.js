import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { getUserData, setToken } from "../utils/userdata";
import { router, useLocalSearchParams } from "expo-router";
import ProfileButton from "../components/ProfileButton";
import icons from "../constants/icons";
import { service } from "../utils/service";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [mine, setMine] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await service.get(`/user/${id}`);
        setUserData(res.data);

        const data = await getUserData();
        if (data.id === id) {
          setMine(true);
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const logout = async () => {
    await setUserData({});
    await setToken("");
    router.replace("/");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    const image = result.assets[0];

    try {
      const response = await service.post("/user/pfp", {
        image: image.base64,
        mimeType: image.mimeType,
      });

      if (response.success) {
        setUserData({ ...userData, pfp: response.data.imageUrl });
      }
    } catch (err) {
      setError("An error occurred while updating the profile picture.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="justify-center items-center w-full h-full bg-primary">
          <ActivityIndicator size="large" color="#8A8A8A" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 ">
        <View className="justify-center items-center w-full h-full bg-primary">
          <Text className="text-textgray text-lg">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex justify-start bg-primary w-full h-full">
        <View className="relative w-full h-[53%]">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
          >
            <View className="bg-darkgray p-2 rounded-full">
              <Image
                source={icons.leftArrow}
                className="w-8 h-8 rounded-full"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          {mine && (
            <TouchableOpacity
              onPress={pickImage}
              style={{ position: "absolute", bottom: 25, right: 25, zIndex: 10 }}
            >

                <Image
                  source={icons.edit}
                  className="w-7 h-7"
                  tintColor="#FAA41A"
                  resizeMode="contain"
                />

            </TouchableOpacity>
          )}
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
        <View className="mx-8 my-5 flex flex-col">
          <View className="flex flex-col">
            <View className="flex flex-row">
              <Text className="text-white font-extrabold text-4xl">
                {userData.name}
              </Text>
              <View className="flex items-center justify-center border-2 rounded-full px-4 py-1 mx-3 border-secondary">
                <Text className="text-secondary font-bold">
                  {userData.role}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-gray text-lg">@{userData.username}</Text>
              <Text className="text-secondary text-lg">{userData.post}</Text>
            </View>
          </View>
          {mine ? (
            <View className="flex justify-center items-center mt-8">
              <ProfileButton
                icon={icons.profile_password}
                value="Change Password"
                handlePress={() => router.push("/change-password")}
              />
              <ProfileButton
                icon={icons.invoice}
                value="My Invoices"
                handlePress={() => router.push("/my-invoices")}
              />
              <ProfileButton
                icon={icons.logOut}
                value="Logout"
                handlePress={logout}
              />
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
