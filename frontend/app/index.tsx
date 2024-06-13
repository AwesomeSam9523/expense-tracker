import "../global.css";
import {Image, StyleSheet, View, Text} from "react-native";

export default function Index() {
  return (
    <View style={styles.mainView}>
      {/* Write code here */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});
