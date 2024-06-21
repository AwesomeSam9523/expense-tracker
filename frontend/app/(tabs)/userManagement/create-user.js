import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import EventForm from "../../../components/EventForm";
import icons from "../../../constants/icons";
import SubmitButton from "../../../components/SubmitButton";
import {service} from "../../../utils/service";

const CreateEvent = () => {

  const [user, setUser] = useState({
    name: "",
    post: "",
    role: "",
    username: ""
  });

  async function submit() {
    const response = await service.post("/user/add", user);
    console.log(response);
    if (response.success) {
      router.back();
    }
  }

  const radioButtonsData = ["EC", "CC", "JC"];
  const [discriminator, setDiscriminator] = useState(Math.floor(1000 + Math.random() * 9000));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="h-full flex justify-start px-4 bg-primary pt-[5%]">
        <View className="flex flex-row items-center mb-5">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <View className="bg-darkgray p-2 rounded-full">
              <Image
                source={icons.leftArrow}
                className="w-8 h-8  rounded-full"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <View className="mx-5">
            <Text className="text-white text-5xl font-bextrabold ">
              Create User
            </Text>
          </View>
        </View>
        <ScrollView className="flex w-full flex-grow max-h-[100%]">
          <View className="my-16 flex items-center">
            <EventForm
              icon={icons.user}
              value={user.name}
              handleChangeText={(e) => setUser({ ...user, name: e, username: e.replaceAll(' ', '').toLowerCase() + discriminator })}
              placeholder="Full name"
            />

            <EventForm
              icon={icons.designation}
              value={user.post}
              handleChangeText={(e) => setUser({ ...user, post: e })}
              placeholder="Post"
            />

            <View className="flex flex-row w-full px-10 justify-between py-5">
              {radioButtonsData.map((data, key) => {
                return (
                  <View key={key} className={`flex flex-row rounded-full border-2 px-6 py-2 mx-5 ${user.role === data ? 'border-secondary' : 'border-gray'}`}>
                    <TouchableOpacity
                      className="flex flex-row w-full"
                      onPress={()=> {setUser({...user, role: data})}}>
                      {/*<Image source={icons.unchecked} />*/}
                      <Text className={`text-xl ${user.role === data ? 'text-secondary' : 'text-gray'}`}>{data}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>

            <EventForm
              icon={icons.id}
              placeholder={user.username}
              editable={false}
            />

            <View className="my-12">
              <SubmitButton handlePress={submit} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateEvent;
