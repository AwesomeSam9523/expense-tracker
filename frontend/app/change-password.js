import {SafeAreaView} from "react-native-safe-area-context";
import {Text, View, ScrollView, TouchableOpacity, Image} from "react-native";
import icons from "../constants/icons";
import React, {useState} from "react";
import FormField from "../components/FormField";
import SubmitButton from "../components/SubmitArrow";
import {service} from "../utils/service";
import {setToken} from "../utils/userdata";
import {router} from "expo-router";


const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submit() {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be atleast 8 characters long");
      return;
    }

    const response = await service.post('/user/changePassword', {newPassword});
    console.log(response);
    if (response.success) {
      const token = response.data;
      await setToken(token);
      router.replace("(tabs)");
    }
  }

  return (

    <SafeAreaView style={{flex: 1}}>
      <ScrollView className='bg-primary h-full pt-[5%] w-full px-6' contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{position: "absolute", top: 10, left: 20, zIndex: 10}}
        >
          <View className="bg-darkgray p-2 rounded-full">
            <Image
              source={icons.leftArrow}
              className="w-8 h-8 rounded-full"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <View className="flex flex-col gap-2 pt-[50%]">
          <Text className="text-white text-4xl font-bextrabold">Welcome Aboard!</Text>
          <Text className="text-gray text-xl">Time to secure your journey with a new password.</Text>
        </View>
        <View className="pt-8">
          <FormField
            icon={icons.password}
            value={newPassword}
            handleChangeText={setNewPassword}
            placeholder="Enter new password"
            type="Password"
          />
          <FormField
            icon={icons.password}
            value={confirmPassword}
            handleChangeText={setConfirmPassword}
            placeholder="Confirm password"
            type="Password"
          />
        </View>

        <View className='my-12'>
          <SubmitButton handlePress={submit}/>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default ChangePassword;
