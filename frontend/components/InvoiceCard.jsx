import { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import icons from '../constants/icons';
import { getToken } from '../utils/userdata';
import { router } from 'expo-router';

export function InvoiceCard({ invoice }) {
  const { amount, name, fileUrl, role, pfp, accepted } = invoice;
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
    <TouchableOpacity onPress={() => router.push('pendingInvoice/view-invoice?fileUrl=' + fileUrl)}>
      <View className=" flex flex-row justify-between items-center bg-darkgray p-4 rounded-3xl mb-4">
        <View className=" flex flex-row items-center">
          {pfp ? <Image source={{
              uri: pfp,
              method: 'GET',
              headers: { Authorization: 'Bearer ' + token },
            }} className="w-14 h-14 rounded-full" resizeMode="cover" />
              : <Image source={icons.userIcon} className="w-14 h-14 rounded-full" resizeMode="contain" />
          }
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
