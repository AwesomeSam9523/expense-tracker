import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import EventForm from "../../../components/EventForm";
import icons from "../../../constants/icons";
import ToggleSwitch from "../../../components/ToggleSwitch";
import SubmitButton from "../../../components/SubmitButton";
import {service} from "../../../utils/service";


const CreateEvent = () => {


  const [image, setImage] = useState(null);
  const [toggle, setToggle] = useState(true);


  const handleToggle = () => {
    setToggle(!toggle);
    setEvent({ ...event, acceptingInvoice: toggle });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled) {
      return
    }

    const image =  result.assets[0];
    setEvent({ ...event, image: image.base64, mimeType: image.mimeType });
    setImage(image.uri);
  };

  const [event, setEvent] = useState({
    name: "",
    budget: null,
    description: "",
    acceptingInvoice: toggle,
    image: image,
    mimeType: "",
  });

  async function submit() {
    const response = await service.post("/event/new", event);
    console.debug(response);
    if (response.success) {
      router.back();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="h-full flex justify-start  px-4  bg-primary pt-[5%]">
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
              Create Event
            </Text>
          </View>
        </View>
        <ScrollView className="flex w-full flex-grow max-h-[100%]">
        <View className="my-16 flex items-center">
          <EventForm
            icon={icons.event}
            value={event.name}
            handleChangeText={(e) => setEvent({ ...event, name: e })}
            placeholder="Event name"
          />
          <EventForm
            icon={icons.budget}
            value={event.budget}
            handleChangeText={(e) => setEvent({ ...event, budget: e })}
            placeholder="Event budget"
          />
          <View className={`my-2 bg-darkgray border-1 focus:border-white p-3 w-full  ${image ? "rounded-xl" : "rounded-full"}`}>
            <View className="items-center flex-row">
              <Text className="flex-1 px-5 text-textgray text-xl font-pregular">
                Upload Banner
              </Text>
              <View className="bg-secondary rounded-full h-14 w-14 flex items-center justify-center">
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    source={icons.upload}
                    className="h-7 w-7 mx-1"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {image && (
              <View className="mt-4">
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
              </View>
            )}
          </View>

          <View className="my-2 w-full bg-darkgray border-1  p-3 h-40  rounded-3xl items-center flex-row">
            <TextInput
              className="flex-1 px-5 py-3 text-white text-xl font-pregular"
              placeholder="Event Description"
              placeholderTextColor="#A6A6A6"
              selectionColor="#ffffff"
              value={event.description}
              onChangeText={(e) => {
                setEvent({ ...event, description: e });
              }}
              multiline={true}
              style={{
                paddingTop: 12,
                height: "100%",
                textAlignVertical: "top",
              }}
            />
          </View>
          <View className="my-2 items-center flex-row bg-darkgray px-5 border-1 h-20 w-full rounded-full justify-between">
            <Text className="text-white text-xl  font-pbold">
              Accepting Invoices
            </Text>
            <View className="pb-5">
              <ToggleSwitch handleToggle={handleToggle} toggle={toggle} />
            </View>
          </View>
          <View className="my-6">
            <SubmitButton handlePress={submit} />
          </View>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateEvent;
