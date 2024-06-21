import { TouchableOpacity, Text,  View } from "react-native";


const SubmitButton = ({
    handlePress,
    isLoading
  }) => {
    return (
      <View className={`bg-transparent border-2 border-secondary rounded-full px-8 h-16 w-40  justify-center items-center ${isLoading ? "opacity-50" : "opacity-100"} `}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={isLoading}       
        >
          <Text className="text-xl font-pmedium  text-secondary">Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default SubmitButton