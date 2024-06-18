import {View, Text, Image} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import icons from "../constants/icons";
import FormField from '../components/FormField';
import CheckBox from "../components/CheckBox"
import SubmitButton from "../components/SubmitButton"
import {Link, router} from 'expo-router';

const SignIn = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const submit = () => {
    router.replace("(tabs)");
  };

  return (

    <SafeAreaView style={{flex: 1}}>

      <View className='bg-primary h-full items-center pt-[25%] w-full'>
        <Image source={icons.one_zero} className='h-32 w-32' resizeMode='contain'/>
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
            <View className='flex-row my-3 justify-between items-center '>
              <View className='flex-row items-center'>
                <CheckBox isChecked={rememberMe} setIsChecked={setRememberMe}/>
                <Text className='text-gray text-sm mx-1'>Remember me</Text>
              </View>
              <Link className='text-gray text-sm' href="/forgot">Forgot Password?</Link>
            </View>
          </View>
        </View>
        <View className='my-12'>
          <SubmitButton handlePress={submit}/>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default SignIn;
