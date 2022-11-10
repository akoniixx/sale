import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const API_URL = 'https://api-dev-sellcoda.iconkaset.com';

const request = axios.create({
  baseURL: API_URL,
});
export const TOKEN_KEY = 'token';
request.interceptors.request.use(
  async function (config) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return {
      ...config,
      headers: {
        accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...(config.headers || {}),
      },
    };
  },
  function (error) {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);
export { request };
