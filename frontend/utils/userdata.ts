import AsyncStorage from '@react-native-async-storage/async-storage';

async function getUserData() {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
}

async function setUserData(value: object) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('userData', jsonValue);
  } catch (e) {
    console.log(e);
  }
}

async function setToken(value: string) {
  try {
    await AsyncStorage.setItem('token', value);
  } catch (e) {
    console.log(e);
  }
}

async function getToken() {
  try {
    return await AsyncStorage.getItem('token');
  } catch (e) {
    console.log(e);
  }
}

export { getUserData, setUserData, setToken, getToken };
