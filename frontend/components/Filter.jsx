import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

function FilterButton({title, handlePress}) {
    return (
        <TouchableOpacity onPress={handlePress}>
            <View className="bg-primary p-4 rounded-full my-1">
                <Text className="text-white text-center text-xl font-pmedium">{title}</Text>
            </View>

        </TouchableOpacity>
    )
}

function FilterModal({ visible, toggle }) {
    const [filter, setFilter] = useState()
    console.log(filter)
    return (
        <Modal isVisible={visible} onBackdropPress={toggle} backdropOpacity={0.30}>
            <View className="bg-modal rounded-lg p-6">
                <Text className="text-white text-3xl font-bold mb-4 font-bextrabold">Search by filters</Text>
                <View className="px-5">
                    <FilterButton title={"Event Name"} handlePress={()=>{setFilter("eventname")}} />
                    <FilterButton title={"Newest to Oldest"} handlePress={()=>{setFilter("eventname")}}/>
                    <FilterButton title={"Oldest to Newest"} handlePress={()=>{setFilter("eventname")}}/>
                    <FilterButton title={"High to Low Amount"} handlePress={()=>{setFilter("eventname")}}/>
                    <FilterButton title={"Low to High Amount"} handlePress={()=>{setFilter("eventname")}}/>
                </View>


            </View>
        </Modal>
    );
}

export default FilterModal;
