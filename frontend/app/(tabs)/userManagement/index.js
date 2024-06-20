import React, {useState, useEffect} from 'react';
import {FlatList, Image, RefreshControl, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import icons from "../../../constants/icons";
import SearchBar from "../../../components/SearchBar";
import AddButton from "../../../components/AddButton";
import {UserCard} from "../../../components/UserCard";
import {service} from "../../../utils/service";

export default function UserManagementScreen() {

  const [searchPhrase, setSearchPhrase] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    service.get(`/user/all?search=${searchPhrase}`).then((response) => {
      setUsers(response.data);
      setRefreshing(false);
    });
  }, [searchPhrase, refreshing]);

  return (
    <SafeAreaView style={{flex: 1}}>

      <View className="w-full h-full flex justify-start items-center px-4 bg-primary pt-[5%]">
        <View className="flex flex-row items-center justify-between w-full">
          <Image source={icons.cs} className="w-44 h-16" resizeMode="contain"/>
          <Image source={icons.userIcon} className="w-16 h-16" resizeMode="contain"/>
        </View>

        <View className="flex flex-row w-full justify-between items-center py-8">
          <SearchBar setSearchPhrase={setSearchPhrase} placeholder={"Search any user"} />

          <TouchableOpacity>
            <Image source={icons.filter} className="w-8 h-8" resizeMode="contain"/>
          </TouchableOpacity>
        </View>

        <FlatList
          className="flex w-full flex-grow max-h-[70%]"
          data={users}
          renderItem={({item}) => (
            <UserCard key={item.id} user={item} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <AddButton text={"Add new user"} route={"userManagement/create-user"}/>
      </View>

    </SafeAreaView>
  );
}
