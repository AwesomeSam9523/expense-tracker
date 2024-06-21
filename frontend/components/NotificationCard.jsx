import { View, Text, Image } from 'react-native'
import React from 'react'
import icons from "../constants/icons"

const NotificationCard = ({ accepted, invoiceId, event}) => {
    return (
        <View className='flex-row w-full items-center p-4  bg-primary border-b-[0.5px] border-gray'>
            <Image className="h-16 w-16" source={accepted ? icons.correct : icons.cross} />
            <View className="pl-3 flex-1">
                <Text className="text-white font-pmedium text-lg">{accepted ? "Invoice ACCEPTED" : "Invoice NOT ACCEPTED"}</Text>
                <Text className="text-textgray  font-pregular text-sm">Your invoice {invoiceId} for {event} {accepted ? "was accepted" : "was not accepted"}</Text>
            </View>

        </View>
    )
}

export default NotificationCard