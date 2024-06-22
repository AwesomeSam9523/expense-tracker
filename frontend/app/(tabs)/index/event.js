import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {service} from "../../../utils/service";

function Event() {

  const [data, setData] = useState({});
  const { eventId } = useLocalSearchParams();

  useEffect(() => {
    async function fetchData() {
      const response = await service.get(`/event/${eventId}`);
      if (response.success) {
        setData(response.data);
      }
    }

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>

    </SafeAreaView>
  )
}

export default Event;
