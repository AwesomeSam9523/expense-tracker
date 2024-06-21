import {View, Text, Image, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import icons from "../constants/icons"
import {service} from "../utils/service";

const NotificationCard = ({invoiceData}) => {
  const {id, data, type} = invoiceData;
  const accepted = type === 'success';

  const [read, setRead] = useState(invoiceData.read);

  async function handleRead() {
    const response = await service.post('/notification/read', {id});
    console.log(response.data);
    if (response.success) {
      setRead(true);
    }
  }

  return (
    <TouchableOpacity onPress={handleRead}>
      <View className={`flex-row w-full items-center p-4 border-b-[0.5px] border-gray ${read ? 'bg-primary' : 'bg-notifUnread'}`}>
        <Image className="h-16 w-16" source={accepted ? icons.correct : icons.cross}/>
        <View className="pl-3 flex-1">
          <Text className="text-white font-pmedium text-lg">{
            accepted ? "Invoice ACCEPTED" : "Invoice REJECTED"}
          </Text>
          <Text className="text-textgray font-pregular text-sm">
            {data}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  )
}

export default NotificationCard
