import {Image} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const token = "326490a0-9fc0-4ca3-a8bc-ac22dde0b710"

function ViewInvoice() {

  const { fileUrl} = useLocalSearchParams();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Image source={{
          uri: fileUrl,
          method: 'GET',
          headers: { Authorization: 'Bearer ' + token },
        }} className="w-full h-full" resizeMode="contain"
      />
    </SafeAreaView>
  )
}

export default ViewInvoice;
