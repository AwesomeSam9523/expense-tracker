import React, {useEffect, useState} from 'react';
import {View, Text, RefreshControl, FlatList} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import TopHeader from "../../../components/TopHeader";
import {service} from "../../../utils/service";
import PendingInvoiceCard from "../../../components/PendingInvoiceCard";

export default function PendingInvoices() {

  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    service.get('/invoice/pending').then((response) => {
      setPendingInvoices(response.data);
      setRefreshing(false);
      console.log(response.data);
    });
  }, [refreshing]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="w-full h-full flex justify-start items-center px-4 bg-primary pt-[5%]">
        <TopHeader />

        <Text className="text-4xl text-white font-bold pt-[8%]">Pending Invoices</Text>

        <FlatList
          className="flex w-full flex-grow max-h-[70%] pt-[8%]"
          data={pendingInvoices}
          renderItem={({item}) => (
            <PendingInvoiceCard key={item.id} invoice={item} onAction={onRefresh} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
}
