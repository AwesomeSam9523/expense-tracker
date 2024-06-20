import {View, Text, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import icons from "../constants/icons";
import FormField from '../components/FormField';
import SubmitButton from "../components/SubmitArrow"
import {router} from 'expo-router';
import {service} from "@/utils/service";
import {setUserData} from "@/utils/userdata";

const SignIn = () => {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const submit = () => {
    router.replace("(tabs)");
  };

  useEffect(() => {
    async function fetchData() {
      const response = await service.get('/user/me');
      console.log(response);
      if (response.success) {
        await setUserData(response.data);
      }
    }

    fetchData();
  }, []);

  return (

    <SafeAreaView style={{flex: 1}}>

      <ScrollView className='bg-primary h-full pt-[25%] w-full' contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image source={icons.oneZero} className='h-32 w-32' resizeMode='contain'/>
        <View className='mt-12 items-center'>
          <Text className='text-white text-5xl font-bextrabold'>Welcome!</Text>
          <Text className='text-gray text-xl font-pregular pt-5'>Please sign in to your account!</Text>
          <View className='mx-6 mt-8'>
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
        <View className='my-12'>
          <SubmitButton handlePress={submit}/>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default SignIn;
