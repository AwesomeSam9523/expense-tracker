import React, { useState } from "react";
import { TextInput, View, Keyboard, Image, ScrollView } from "react-native";
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

const SearchBar = ({ setSearchPhrase, placeholder }) => {
  const [currentPhrase, setCurrentPhrase] = useState('');

  return (
    <View className="flex flex-row w-[85%]">
      <ScrollView className="w-full">

        <View className="bg-darkgray border-1 focus:border-white  p-3 w-full rounded-3xl items-center flex-row">

          <Image source={icons.search} className="w-8 h-8" resizeMode="contain" />
          <TextInput
            className="flex-1 px-3 text-primary text-xlg"

            placeholder={placeholder}
            placeholderTextColor="#9A9393"
            selectionColor={'#151515'}
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
