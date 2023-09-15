import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { navigate } from '../navigations/RootNavigator';
import { useAuth } from '../contexts/AuthContext';

export const API_URL = 'https://api-dev-sellcoda.iconkaset.com';
//export const API_URL = 'https://api-sellcoda.iconkaset.com';


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
  async function (error) {
    if (error.response.status === 401) {
       await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('fcmtoken');
      navigate('Auth',{
        screen: 'LoginScreen'
      })
    }
    return Promise.reject(error);
  },
);
export { request };
