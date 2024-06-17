const BASE_URL = process.env.PRODUCTION ? 'https://ieeecs-expense-tracker.vercel.app' : 'http://192.168.1.11:3000';
const TOKEN = '326490a0-9fc0-4ca3-a8bc-ac22dde0b710';
console.log('BASE_URL', BASE_URL);

const get = async (url: string) => {
  console.debug('GET', `${BASE_URL}${url}`)

  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    }
  });

  console.debug('GET response', response.status)
  return response.json();
};

const post = async (url: string, data: any) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const put = async (url: string, data: any) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

class Service {
  get = get;
  post = post;
  put = put;
}

export const service = new Service();
