import "@/global.css";
import {
  Image,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Button,
  Text
} from "react-native";
import icons from "../../../constants/icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { service } from "../../../utils/service";
import { EventCard } from "../../../components/EventCard";
import SearchBar from "../../../components/SearchBar";
import AddButton from "../../../components/AddButton";
import TopHeader from "../../../components/TopHeader";
import {getUserData} from "../../../utils/userdata";
import FilterModal from "../../../components/Filter";
function Index() {
  const [events, setEvents] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    service.get(`/event/list?search=${searchPhrase}`).then((response) => {
      setEvents(response.data);
      setRefreshing(false);
    });
  }, [searchPhrase, refreshing]);

  useEffect(() => {
    getUserData().then(setUserData);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="w-full h-full flex justify-start items-center px-4 bg-primary pt-[5%]">
        <TopHeader />

        <View className="flex flex-row w-full justify-between items-center py-8">
          <SearchBar
            setSearchPhrase={setSearchPhrase}
            placeholder={"Search any event"}
          />

          <View className="flex-1 items-center justify-center">
            <TouchableOpacity onPress={toggleModal} >
              <Image
                source={icons.filter}
                className="w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <FilterModal visible={isModalVisible} toggle={toggleModal} />
          </View>
        </View>

        <FlatList
          className="flex w-full flex-grow max-h-[70%]"
          data={events}
          renderItem={({ item }) => (
            <EventCard
              key={item.id}
              event={item}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {userData.role === 'EC' ? <AddButton text={"Add new event"} route={"create-event"} /> : null}
      </View>
    </SafeAreaView>
  );
}

export default Index;