import {SafeAreaView} from "react-native-safe-area-context";
import {Text, View, ScrollView} from "react-native";
import icons from "../constants/icons";
import React, {useState} from "react";
import FormField from "../components/FormField";
import SubmitButton from "../components/SubmitArrow";
import {service} from "../utils/service";
import {setToken} from "../utils/userdata";
import {router} from "expo-router";

function firstLogin() {
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

    const response = await service.post('/user/changePassword', { newPassword });
    console.log(response);
    if (response.success) {
      const token = response.data;
      await setToken(token);
      router.replace("(tabs)");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className='bg-primary h-full pt-[25%] w-full px-6' contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View className="flex flex-col gap-2">
          <Text className="text-white text-4xl font-bextrabold">Hey first timer!</Text>
          <Text className="text-gray text-xl">Let's get some things setup for you.</Text>
        </View>

        <View className="pt-24">
          <FormField
            icon={icons.password}
            value={newPassword}
            handleChangeText={setNewPassword}
            placeholder="New password"
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

export default firstLogin;
