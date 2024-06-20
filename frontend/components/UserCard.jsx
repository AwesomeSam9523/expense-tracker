import {View, Image, Text, TouchableOpacity} from "react-native";
import icons from "../constants/icons";
import {useState} from "react";
import ToggleSwitch from "./ToggleSwitch";
import {service} from "../utils/service";
const token = '326490a0-9fc0-4ca3-a8bc-ac22dde0b710';

export function UserCard({user}) {
  const {name, pfp, role, enabled, username, id} = user;
  const [isEnabled, setIsEnabled] = useState(enabled);
  async function handleToggle() {

    // Call API to update user status
    const res = await service.post(`/user/${isEnabled ? 'disable' : 'enable'}`, { id })
    if (res.success) {
      setIsEnabled(!isEnabled);
    }
  }

  return (
    <View className="flex flex-row w-full h-16 mb-4 p-2 rounded-full items-center justify-between bg-darkgray">
      <View className="flex flex-row items-center">
        {pfp ? <Image source={{
          uri: pfp,
          method: 'GET',
          headers: { Authorization: 'Bearer ' + token },
        }} className="w-12 h-12 rounded-full" resizeMode="contain" />
          : <Image source={icons.userIcon} className="w-12 h-12 rounded-full" resizeMode="contain" />
        }
        <View>
          <Text className={`text-xl font-bold pl-4 ${role === 'EC' ? 'color-ECcolor' : (role === 'CC' ? 'color-CCcolor' : 'color-JCcolor')}`}>{name}</Text>
          <Text className="text-sm pl-4 text-gray">{username}</Text>
        </View>
      </View>

      <View className="flex flex-row items-center gap-1.5">
        <TouchableOpacity>
          <ToggleSwitch toggle={isEnabled} handleToggle={handleToggle} size={"small"} />
        </TouchableOpacity>
        <TouchableOpacity>
          <View className="bg-secondary p-1 rounded-full">
            <Image source={icons.userPassword} className="w-5 h-5 m-1" resizeMode="contain" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View className="bg-[#490011] p-1 rounded-full">
            <Image source={icons.deleteIcon} className="w-5 h-5 m-1" resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
