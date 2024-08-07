import React, {useEffect, useState} from "react";
import {View, Text, RefreshControl, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import TopHeader from "../../components/TopHeader";
import NotificationCard from "../../components/NotificationCard";
import {service} from "../../utils/service";
import {getUserData} from "../../utils/userdata";

export default function NotificationsScreen() {

  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({});

  function fetchData() {
    service.get('/notification').then((response) => {
      setNotifications(response.data);
      setRefreshing(false);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUserData().then(setUserData);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    getUserData().then(setUserData);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="w-full h-full flex justify-start items-center px-4 bg-primary pt-[5%]">

        <TopHeader userData={userData} />

        <Text className="text-4xl text-white font-bold pt-[8%]">
          Notifications
        </Text>

        <FlatList
          className="flex w-full flex-grow max-h-[70%] pt-[8%]"
          data={notifications}
          renderItem={({item}) => (
            <NotificationCard key={item.id} invoiceData={item}/>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }
        />

      </View>
    </SafeAreaView>
  );
}
