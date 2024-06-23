import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import EventForm from "../../../components/EventForm";
import icons from "../../../constants/icons";
import SubmitButton from "../../../components/SubmitButton";
import {service} from "../../../utils/service";

const CreateInvoice = () => {
  const [image, setImage] = useState(null);
  const { eventId } = useLocalSearchParams();

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
    setInvoice({ ...invoice, image: image.base64, mimeType: image.mimeType });
    setImage(image.uri);
  };

  const [invoice, setInvoice] = useState({
    amount: 0,
    eventId: eventId,
    image: image,
    mimeType: "",
  });

  async function submit() {
    const response = await service.post("/invoice/new", invoice);
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
              Create Invoice
            </Text>
          </View>
        </View>
        <ScrollView className="flex w-full flex-grow max-h-[100%]">
          <View className="my-16 flex items-center">
            <EventForm
              icon={icons.budget}
              value={invoice.amount}
              handleChangeText={(e) => setInvoice({ ...invoice, amount: parseInt(e) })}
              placeholder="Invoice amount"
              inputMode="numeric"
            />
            <View className={`my-2 bg-darkgray border-1 focus:border-white p-3 w-full ${image ? "rounded-xl" : "rounded-full"}`}>
              <View className="items-center flex-row">
                <Text className="flex-1 px-5 text-textgray text-xl font-pregular">
                  Upload Invoice Image
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
              {image ? (
                <View className="mt-4">
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 10 }}
                  />
                </View>
              ) : null}
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

export default CreateInvoice;
