import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import icons from "../constants/icons";

const ProfileButton = ({ icon, value, handlePress }) => {
  return (
    <View className="my-2 w-80">
      <TouchableOpacity
        style="focus:border-white"
        onPress={handlePress}
      >
        <View className="bg-darkgray border-[0.5px] border-opacity-50 p-2 h-16 w-full rounded-full flex-row items-center justify-between">
          <View className="bg-secondary rounded-full h-12 w-12 flex items-center justify-center">
            <Image source={icon} style={{ height: 24, width: 24 }} resizeMode='contain' />
          </View>
          <Text className="text-white text-lg">{value}</Text>
          <View><Image source={icons.blank} style={{ height: 24, width: 24 }} resizeMode='contain' /></View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileButton;
