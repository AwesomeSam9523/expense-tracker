import {Image, Text, TouchableOpacity, View} from "react-native";
import icons from "../constants/icons";
import {router} from "expo-router";

const AddButton = ({text, route}) => {

    return (
        <TouchableOpacity onPress={() => {
            router.push(`/${route}`)
        }}>
            <View className="flex flex-row bg-darkgray p-2 items-center gap-2 rounded-full my-5">
                <View className="bg-secondary p-2 rounded-full">
                    <Image source={icons.plus} className="w-5 h-5 rounded-full" resizeMode="contain"/>
                </View>
                <Text className="text-white text-md font-pmedium px-1">{text}</Text>
            </View>
        </TouchableOpacity>
    );
};
export default AddButton;
