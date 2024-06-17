// SearchBar.js
import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setCLicked }) => {
   return (
      <View style={styles.container}>
            <View style={clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
            <Feather name="search" size={20} color="lightgrey" style={{ marginLeft: 1 }} />

            <TextInput
               style={styles.input }
               placeholder="Search any event"
               color="lightgrey"
               value={searchPhrase}
               onChangeText={setSearchPhrase}
               onFocus={() => {
                  setClicked(true);
               }}
            />

            {clicked && (
               <Entypo
                  name="cross"
                  size={20}
                  color="lightgrey"
                  style={{ padding: 1 }}
                  onPress={() => {
                     setSearchPhrase("");
                  }}
               />
            )}
         </View>

         {clicked && (
            <View>
               <Button
                  title="Cancel"
                  onPress={() => {
                     Keyboard.dismiss();
                     setClicked(false);
                  }}></Button>
            </View>
         )}
      </View>
   );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
   container: {
      margin: 10,
      justifyContent: "flex-start",
      marginLeft: "10",
      marginTop:"60",
      flexDirection: "row",
      width: "80%",
   },
   searchBar__unclicked: {
      padding: 10,
      flexDirection: "row",
      width: "95%",
      backgroundColor: "#696969",
      borderRadius: 30,
      alignItems: "center",
   },
   searchBar__clicked: {
      padding: 10,
      flexDirection: "row",
      width: "80%",
      backgroundColor: "#696969",
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "space-evenly",
   },
   input: {
      fontSize: 17,
      marginLeft: 10,
      width: "90%",
      color: "lightgrey",
   }
});