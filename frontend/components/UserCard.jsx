import {View, Image, Text, TouchableOpacity, Alert} from "react-native";
import icons from "../constants/icons";
import {useEffect, useState} from "react";
import ToggleSwitch from "./ToggleSwitch";
import {service} from "../utils/service";
import {getToken, getUserData} from "../utils/userdata";

export function UserCard({user}) {
  const {name, pfp, role, enabled, username, id} = user;
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState({});
  const [isEnabled, setIsEnabled] = useState(enabled);

  async function handleToggle() {
    const res = await service.post(`/user/${isEnabled ? 'disable' : 'enable'}`, { id })
    if (res.success) {
      setIsEnabled(!isEnabled);
    }
  }

  async function resetPassword() {
    Alert.alert(
      'Reset Password',
      `Are you sure you want to reset the password for ${name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Reset', onPress: async () => {
            const res = await service.post(`/user/resetPassword`, { username })
            if (res.success) {
              alert('Password reset successful');
            }
          }
        }
      ]
    );
  }

  async function deleteUser() {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${name}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Delete', onPress: async () => {
            const res = await service.post(`/user/delete`, { id })
            if (res.success) {
              alert('User deleted successfully');
            }
          }
        }
      ]
    );
  }

  useEffect(() => {
    getToken().then(setToken);
    getUserData().then(setUserData);
  }, []);

  function checkIfDisallowed() {
    if (role === 'EC') {
      return false;
    }

    if (userData.role === 'CC' && role !== 'JC') {
      return false;
    }

    return true;
  }

  return (
    <View className="flex flex-row w-full h-16 mb-4 p-2 rounded-full items-center justify-between bg-darkgray">
      <View className="flex flex-row items-center">
        {pfp ? <Image source={{
          uri: pfp,
          method: 'GET',
          headers: { Authorization: 'Bearer ' + token },
        }} className="w-12 h-12 rounded-full" resizeMode="cover" />
          : <Image source={icons.userIcon} className="w-12 h-12 rounded-full" resizeMode="contain" />
        }
        <View>
          <Text className={`text-xl font-bold pl-4 ${role === 'EC' ? 'color-ECcolor' : (role === 'CC' ? 'color-CCcolor' : 'color-JCcolor')}`}>{name}</Text>
          <Text className="text-sm pl-4 text-gray">{username}</Text>
        </View>
      </View>

      {checkIfDisallowed() ?
        <View className="flex flex-row items-center gap-1.5">
          <View>
            <ToggleSwitch toggle={isEnabled} handleToggle={handleToggle} size={"small"} />
          </View>
          <TouchableOpacity onPress={resetPassword}>
            <View className="bg-secondary p-1 rounded-full">
              <Image source={icons.userPassword} className="w-5 h-5 m-1" resizeMode="contain" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteUser}>
            <View className="bg-fadered p-1 rounded-full">
              <Image source={icons.deleteIcon} className="w-5 h-5 m-1" resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>
        : null
      }
    </View>
  )
}
