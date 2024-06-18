import React, {useState} from "react";
import {TextInput, View, Keyboard, Image, ScrollView} from "react-native";
import icons from "../constants/icons";

let timer;

function handleInput(phrase, setSearchPhrase) {
  // debounce the input at 200ms
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    setSearchPhrase(phrase);
  }, 200);
}

const SearchBar = ({setSearchPhrase}) => {
  const [currentPhrase, setCurrentPhrase] = useState('');

  return (
    <View className="flex flex-row w-[82%]">
      <ScrollView className="w-full">
        <View className="flex flex-row bg-darkgray p-2 rounded-3xl items-center">
          <Image source={icons.search} className="w-8 h-8" resizeMode="contain"/>

          <TextInput
            className="w-full pl-2 text-white"
            placeholder="Search any event"
            placeholderTextColor="#9A9393"
            value={currentPhrase}
            onChangeText={(phrase) => {
              handleInput(phrase, setSearchPhrase);
              setCurrentPhrase(phrase);
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>
      </ScrollView>

    </View>
  );
};
export default SearchBar;
