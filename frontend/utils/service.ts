import Toast from 'react-native-toast-message';
import {getToken} from "@/utils/userdata.ts";

// const BASE_URL = 'http://192.168.1.8:3000';
const BASE_URL = 'https://ieeecs-expense-tracker.vercel.app';
console.log('BASE_URL', BASE_URL);

const get = async (url: string) => {
  console.debug('GET', `${BASE_URL}${url}`)
  const TOKEN = await getToken();
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    }
  });

  console.debug('GET response to', url, ':', response.status)
  const json = await response.json();

  if (json.message) {
    Toast.show({
      type: response.status === 200 ? 'success' : 'error',
      text1: json.message,
    });
  }

  return json;
};

const post = async (url: string, data: any, headers = {}) => {
  console.debug('POST', `${BASE_URL}${url}`)
  const TOKEN = await getToken();
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
      ...headers,
    },
  });

  console.debug('POST response to', url, 'with payload', data, ':', response.status)
  const json = await response.json();

  if (json.message) {
    Toast.show({
      type: [200, 201].includes(response.status) ? 'success' : 'error',
      text1: json.message,
    });
  }

  return json;
};

class Service {
  get = get;
  post = post;
}

export const service = new Service();
