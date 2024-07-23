import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getToken } from '../utils/userdata';
import { router } from 'expo-router';
import ProfilePicture from "./ProfilePicture";

export function InvoiceCard({ invoice }) {
  const { amount, name, fileUrl, role, pfp, accepted, createdBy } = invoice;
  let status;
  switch (accepted) {
    case true:
      status = 'ACCEPTED';
      break;
    case false:
      status = 'REJECTED';
      break;
    default:
      status = 'PENDING';
  }
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-500';
      case 'PENDING':
        return 'text-orange-500';
      case 'REJECTED':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity onPress={() => router.navigate('view-invoice?fileUrl=' + fileUrl)}>
      <View className=" flex flex-row justify-between items-center bg-darkgray p-4 rounded-3xl mb-4">
        <View className=" flex flex-row items-center">
          <ProfilePicture size={"h-14 w-14"} user={{ pfp, id: createdBy }} token={token} />
          <View>
            <Text className={`text-xl font-bold pl-4 ${role === 'EC' ? 'color-ECcolor' : (role === 'CC' ? 'color-CCcolor' : 'color-JCcolor')}`}>{name}</Text>
            <View className="flex flex-row">
              <Text className="ml-4 text-white">Status:</Text>
              <Text className={`pl-2 ${getStatusColorClass(status)}`} >
               {status}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-xl text-secondary font-bold">Rs {amount}/-</Text>
      </View>
    </TouchableOpacity>
  );
}

export default InvoiceCard;
