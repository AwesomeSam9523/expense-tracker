import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import icons from "../constants/icons"
function FilterButton({ title, handlePress }) {
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
    const filterQuery = filter
    return (
        <Modal isVisible={visible} onBackdropPress={toggle} backdropOpacity={0.30}>
            <View className="bg-modal rounded-lg p-6">
                <View className="flex flex-row items-center"> 
                    <TouchableOpacity
                        onPress={toggle}

                    >
                        <View className="bg-darkgray p-2 rounded-full">
                            <Image
                                source={icons.leftArrow}
                                className="w-8 h-8  rounded-full"
                                resizeMode="contain"
                            />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold mb-4 font-bextrabold px-5">Search by filters</Text>
                </View>
                <View className="px-5">
                    <FilterButton title={"Event Name"} handlePress={() => { setFilter("eventname") }} />
                    <FilterButton title={"Newest to Oldest"} handlePress={() => { setFilter("newtoold") }} />
                    <FilterButton title={"Oldest to Newest"} handlePress={() => { setFilter("oldtonew") }} />
                    <FilterButton title={"High to Low Amount"} handlePress={() => { setFilter("hightolow") }} />
                    <FilterButton title={"Low to High Amount"} handlePress={() => { setFilter("lowtohigh") }} />
                </View>


            </View>
        </Modal>
    );
}

export default FilterModal;
