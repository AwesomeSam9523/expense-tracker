import {Image, TouchableOpacity} from "react-native";
import icons from "../constants/icons";
import {router} from "expo-router";

function ProfilePicture({ user, token, size }) {
  const { id, pfp } = user;
  return (
    <TouchableOpacity onPress={() => router.push('profile?id=' + id)}>
      {pfp ? <Image source={{
            uri: pfp,
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
          }} className={`${size} rounded-full`} resizeMode="cover" />
          : <Image source={icons.userIcon} className={`${size} rounded-full`} resizeMode="contain" />
      }
    </TouchableOpacity>
  );
}

export default ProfilePicture;
