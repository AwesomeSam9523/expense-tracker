import "../global.css";
import {Image, StyleSheet, View, Text} from "react-native";
import icons from "../constants/icons"
import {service} from "@/utils/service";
import {useEffect, useState} from "react";
import {EventCard} from "@/components/EventCard";

type Event = {
  id: string;
  name: string;
  description: string;
  date: string;
  createdAt: string;
  closed: boolean;
  budget: number;
}

const imageUrl = 'https://ess.ieee.org.ua/wp-content/uploads/2016/05/ieee_img.jpg__1320x740_q95_crop_subsampling-2_upscale-1024x574.jpg';

export default function Index() {
  const [events, setEvents] = useState<Event[]>([]);
  const getEvents = async () => {
    const {data} = await service.get('/event/list');
    console.log('events', data);
    setEvents(data);
  }
  useEffect(() => {
    getEvents();
  }, []);

  return (
    <View className="bg-black flex justify-start items-center py-16 px-4">
      <View className="flex basis-1/6 flex-row items-center justify-start gap-4 w-full">
        <Image source={icons.one_zero} className="w-12 h-12" resizeMode="contain"/>
        <Text className="text-4xl font-bold color-white">IEEE CS</Text>
      </View>
      {/*<View className="flex basis-1/6">*/}
      {/*/!*  Search bar *!/*/}
      {/*</View>*/}
      <View className="flex basis-[4/6] w-[90%]">
        <View className="flex flex-col items-center justify-start gap-4 w-full">
          {events.map((event) => (
            <EventCard name={event.name} budget={event.budget} image={imageUrl} key={event.id}/>
          ))}
        </View>
      </View>
    </View>
  );
}
