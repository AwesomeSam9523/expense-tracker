import {View, Image, Text, TouchableOpacity} from "react-native";
import icons from "../constants/icons";
import {service} from "../utils/service";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {getToken} from "../utils/userdata";
import ProfilePicture from "./ProfilePicture";

export function PendingInvoiceCard({invoice, onAction}) {
  const {amount, eventName, fileUrl, id, name, pfp, role, createdBy} = invoice;
  const [token, setToken] = useState('');

  async function handleAction(action) {
    const res = await service.post(`/invoice/${action}`, { id });
    console.debug(res);
    if (res.success) {
      onAction();
    }
  }

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  return (
    <TouchableOpacity onPress={() => router.navigate('pendingInvoice/view-invoice?fileUrl=' + fileUrl)}>
      <View className="flex flex-row w-full h-20 mb-4 p-2 rounded-2xl items-center justify-between bg-darkgray">
        <View className="flex flex-row items-center">
          <ProfilePicture size={"h-14 w-14"} user={{ pfp, id: createdBy }} token={token} />
          <View>
            <Text className={`text-xl font-bold pl-4 ${role === 'EC' ? 'color-ECcolor' : (role === 'CC' ? 'color-CCcolor' : 'color-JCcolor')}`}>{name}</Text>
            <Text className="text-sm pl-4 text-white">{eventName}</Text>
            <Text className="text-sm pl-4 text-secondary font-bold">Rs {amount}/-</Text>
          </View>
        </View>

        <View className="flex flex-row items-center gap-3">
          <TouchableOpacity onPress={() => handleAction('reject')}>
            <View className="rounded-full">
              <Image source={icons.cross} className="w-10 h-10" resizeMode="contain" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAction('accept')}>
            <View className="rounded-full">
              <Image source={icons.correct} className="w-10 h-10" resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PendingInvoiceCard;
