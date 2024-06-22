import {Image} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import {getToken} from "../../../utils/userdata";

function ViewInvoice() {

  const { fileUrl} = useLocalSearchParams();
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken().then(setToken);
  }, []);

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
