import React, {useEffect, useState} from "react";
import {getToken, getUserData, setToken, setUserData} from "../utils/userdata";
import {service} from "../utils/service";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import icons from "../constants/icons";
import InvoiceCard from "../components/InvoiceCard";

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setIsLoading(true);

      const invoiceResponse = await service.get(`/invoice/mine`);
      setInvoices(invoiceResponse.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    getToken().then(setToken);
    getUserData().then(setUserData);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="justify-center items-center w-full h-full bg-primary">
          <ActivityIndicator size="large" color="#8A8A8A" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 ">
        <View className="justify-center items-center w-full h-full bg-primary">
          <Text className="text-textgray text-lg">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-primary h-full pt-[5%] w-full px-6">
        <View className="flex flex-row items-center gap-3">
          <View className="bg-darkgray p-2 rounded-full w-12 h-12">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Image
                source={icons.leftArrow}
                className="w-8 h-8 rounded-full"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-4xl font-bextrabold">My Invoices</Text>
        </View>
        <View className="w-full flex items-center pt-[10%]">
          <FlatList
            className="flex flex-grow h-[95%] w-full"
            data={invoices}
            renderItem={({ item }) => <InvoiceCard invoice={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MyInvoices;
