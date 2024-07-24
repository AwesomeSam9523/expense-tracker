import {View, Text, Image, ScrollView, ActivityIndicator, Alert, BackHandler} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "../constants/icons";
import FormField from "../components/FormField";
import SubmitButton from "../components/SubmitArrow";
import {router} from "expo-router";
import {service} from "@/utils/service";
import {setUserData, setToken} from "@/utils/userdata";

const SignIn = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [request, setRequest] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);

  const submit = async () => {
    if (!form.username || !form.password) {
      return setErrorMessage("All fields are required.");
    }
    setLoading(true);
    try {
      const response = await service.post("/user/login", form);
      console.log("response data-->", response);
      if (!response.success) {
        setErrorMessage(response.message);
        return;
      } else {
        const token = response.data;
        await setToken(token);
        setRequest(token);
        setErrorMessage(null);
      }
      console.log("success")
    } catch (error) {
      setErrorMessage(error.message || "Login Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await service.get("/user/me");
      console.log(response);
      if (response.success) {
        const {data} = response;
        await setUserData(data);
        if (!data.firstLogin) {
          router.replace("(tabs)");
        } else {
          router.replace("/first-login");
        }
      }
      setAutoLogin(false);
    }

    fetchData();
  }, [request]);

  if (autoLogin) {
    return (
      <SafeAreaView className="flex-1">
        <View className="justify-center items-center w-full h-full bg-primary gap-2">
          <ActivityIndicator size="large" color="#8A8A8A" />
          <Text className="text-xl text-gray">Logging In</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        className="bg-primary h-full pt-[25%] w-full"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={icons.oneZero}
          className="h-32 w-32"
          resizeMode="contain"
        />
        <View className="mt-12 items-center">
          <Text className="text-white text-5xl font-bextrabold">Welcome!</Text>
          <Text className="text-gray text-xl font-pregular pt-5">
            Please sign in to your account!
          </Text>
          <View className="mx-6 mt-8">
            <FormField
              type="Username"
              icon={icons.user}
              value={form.username}
              handleChangeText={(e) => setForm({...form, username: e})}
              placeholder="Username"
            />
            <FormField
              type="Password"
              icon={icons.password}
              value={form.password}
              handleChangeText={(e) => setForm({...form, password: e})}
              placeholder="Password"
            />
          </View>
        </View>
          {errorMessage ? <Text className="text-red-500 text-xl">{errorMessage}</Text> : null}
        <View className="my-12">
          <SubmitButton handlePress={submit} isLoading={loading}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
