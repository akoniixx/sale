import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../../config/request';

export interface SpecialRequestGet {
  page: number;
  take?: number;
  startDate?: string;
  endDate?: string;
  searchText?: string;
  status?: string[];
  company: 'ICPL' | 'ICPI' | 'ICPF';
  isSpecialRequest?: boolean;
  userStaffId?: string;
  search?: string;
  customerZones: string[];
}
const getListSpecialRequest = async ({
  customerZones,
  ...payload
}: SpecialRequestGet) => {
  const userStaffId = await AsyncStorage.getItem('userStaffId');
  if (!userStaffId) {
    throw new Error('userStaffId not found');
  }
  if (!payload.status) {
    payload.status = ['WAIT_APPROVE_ORDER'];
  }
  if (!payload.take) {
    payload.take = 6;
  }

  payload.isSpecialRequest = true;
  //   payload.userStaffId = userStaffId as string;

  const query = new URLSearchParams(payload as any).toString();
  const customerQ = customerZones
    .map(zone => `customerZones=${zone}`)
    .join('&');
  //   console.log('query', `/order-cart/order?${query}&${customerQ}`);
  return await request
    .get(`/order-cart/order?${query}&${customerQ}`)
    .then(res => res.data);
};

export const SpecialRequestServices = {
  getListSpecialRequest,
};
