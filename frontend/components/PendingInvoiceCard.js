import {View, Image, Text, TouchableOpacity} from "react-native";
import icons from "../constants/icons";
import {service} from "../utils/service";
import {router} from "expo-router";
const token = '326490a0-9fc0-4ca3-a8bc-ac22dde0b710';

export function PendingInvoiceCard({invoice, onAction}) {
  const {amount, eventId, eventName, fileUrl, id, name, pfp, username, role} = invoice;

  async function handleAction(action) {
    const res = await service.post(`/invoice/${action}`, { id });
    console.debug(res);
    if (res.success) {
      onAction();
    }
  }

  return (
    <TouchableOpacity onPress={() => router.push('pendingInvoice/view-invoice?fileUrl=' + fileUrl)}>
      <View className="flex flex-row w-full h-20 mb-4 p-2 rounded-2xl items-center justify-between bg-darkgray">
        <View className="flex flex-row items-center">
          {pfp ? <Image source={{
              uri: pfp,
              method: 'GET',
              headers: { Authorization: 'Bearer ' + token },
            }} className="w-14 h-14 rounded-full" resizeMode="contain" />
            : <Image source={icons.userIcon} className="w-14 h-14 rounded-full" resizeMode="contain" />
          }
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
