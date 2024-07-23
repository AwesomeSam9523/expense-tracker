import { Image, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getToken } from "../utils/userdata";

function ViewInvoice() {
  const { fileUrl } = useLocalSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  return (
    <SafeAreaView className="flex-1 ">
     <View className="bg-primary">
        <Image
          source={{
            uri: fileUrl,
            method: "GET",
            headers: { Authorization: "Bearer " + token },
          }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

export default ViewInvoice;
