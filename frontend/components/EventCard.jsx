import {View, Image, Text, TouchableOpacity} from "react-native";
import icons from "../constants/icons";
import {router} from "expo-router";
const token = '326490a0-9fc0-4ca3-a8bc-ac22dde0b710';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function EventCard({event, userRole}) {
  const {id, name, image, budget, closed} = event;
  return (
    <View className="flex flex-col w-full h-40 mb-4">
      <Image source={{
        uri: image,
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      }} className="w-full h-full rounded-3xl" resizeMode="cover" />
      <View className="absolute top-0 bg-[#00000090] w-full h-full pt-12 pl-8 rounded-3xl">
        <View className="flex flex-row text-base gap-1.5">
          {userRole === 'EC' ? <Text className="text-2xl">{closed ? '🔴' : '🟢'}</Text> : null}
          <Text className="text-4xl font-bold color-white">{name}</Text>
        </View>
        <Text className="text-xl font-bold color-white pt-1">Rs {numberWithCommas(budget)}/-</Text>
      </View>
      <View className="absolute bg-[#262626] rounded-full bottom-2 right-2 p-2 z-10">
        <TouchableOpacity onPress={() => {router.push('/event?eventId=' + id)}}>
          <Image source={icons.rightArrow} className="w-8 h-8" resizeMode="contain"/>
        </TouchableOpacity>
      </View>
    </View>
  )
}
