import "@/global.css";
import {Image, View,TouchableOpacity, ScrollView} from "react-native";
import icons from "../../../constants/icons"
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {service} from "../../../utils/service";
import {EventCard} from "../../../components/EventCard";
import SearchBar from "../../../components/SearchBar";
import {router} from "expo-router";
import AddButton from "../../../components/AddButton";

function Index() {
  const [events, setEvents] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  useEffect(() => {
    service.get(`/event/list?search=${searchPhrase}`).then((response) => {
      setEvents(response.data);
    });
  }, [searchPhrase]);

  return (
    <SafeAreaView style={{flex: 1}}>

      <View className="w-full h-full flex justify-start items-center px-4 bg-primary pt-[5%]">
        <View className="flex flex-row items-center justify-between w-full">
          <Image source={icons.cs} className="w-44 h-16" resizeMode="contain"/>
          <Image source={icons.userIcon} className="w-16 h-16" resizeMode="contain"/>
        </View>

        <View className="flex flex-row w-full justify-between items-center py-8">
          <SearchBar setSearchPhrase={setSearchPhrase}/>

          <TouchableOpacity>
            <Image source={icons.filter} className="w-8 h-8" resizeMode="contain"/>
          </TouchableOpacity>

        </View>

        <ScrollView className="flex w-full flex-grow max-h-[70%]">
          <View className="flex flex-col w-full gap-6">
            {events.map((event) => (
              <EventCard key={event.id} name={event.name} image={event.image} budget={event.budget}/>
            ))}
          </View>
        </ScrollView>

        <AddButton text={"Add new event"} route={"create-event"}/>

      </View>

    </SafeAreaView>
  );
}

export default Index;
