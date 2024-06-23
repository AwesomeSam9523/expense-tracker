import { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import icons from '../constants/icons';
import { getToken } from '../utils/userdata';
import { router } from 'expo-router';

export function InvoiceCard({ invoice }) {
  const { amount, name, fileUrl, role, pfp, status} = invoice;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [token, setToken] = useState('');

  useEffect(() => {
    getToken().then(setToken);

    // Simulating real-time updates via props change
    setCurrentStatus(status);
  }, [status]);

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
      <View className=" flex flex-row justify-between items-center bg-darkgray p-4 rounded-lg mb-4">
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
            <Text className={`ml-4 text-sm ${getStatusColorClass(currentStatus)}`} >
             {currentStatus}
            </Text>
          </View>
        </View>
        <Text classname="text-sm text-lg font-bold"> Rs {amount}/-</Text>
      </View>
    </TouchableOpacity>
  );
}

export default InvoiceCard;
