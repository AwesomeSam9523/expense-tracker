import {View, ImageBackground, Image, Text} from "react-native";

export function EventCard({name, image, budget}) {
  console.log('Event Card', name, image, budget);
  return (
    <View className="flex m-4 w-full h-40">
      <Image source={{uri: image}} height={100} className="h-40" resizeMode="cover" />
      <View className="absolute top-0">
        <Text className="text-xl font-bold color-white bg-[#000000c0]">{name}</Text>
        <Text className="text-lg color-white">Budget: {budget}</Text>
      </View>
      {/*</Image>*/}
    </View>
  )
}
