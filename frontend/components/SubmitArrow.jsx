import { TouchableOpacity, Text, Image, View } from "react-native";
import icons from "../constants/icons";

const SubmitButton = ({
  handlePress,
  isLoading
}) => {
  return (
    <View className={`bg-transparent border-2 border-secondary rounded-full py-5 px-8 h-16 justify-center items-center ${isLoading ? "opacity-50" : "opacity-100"} `}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLoading}
        
      >
        <Image className="w-20" resizeMode="contain" source={icons.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default SubmitButton;
