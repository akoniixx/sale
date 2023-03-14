import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../../config/request';

const getFactory = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await AsyncStorage.getItem('user');
    const parseU = JSON.parse(user || '');

    const factoryData = await request.get(
      `/auth/factory?company=${parseU.company}`,
    );
    return factoryData.data[0];
  } catch (error) {
    throw error;
  }
};
export const factoryServices = {
  getFactory,
};
