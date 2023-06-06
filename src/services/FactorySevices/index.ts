import { request } from '../../config/request';

const getFactory = async (company: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const factoryData = await request.get(`/auth/factory?company=${company}`);
    return factoryData.data[0];
  } catch (error) {
    throw error;
  }
};
export const factoryServices = {
  getFactory,
};
