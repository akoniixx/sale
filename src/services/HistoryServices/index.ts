import { request } from '../../config/request';

interface PayloadHistory {
  page: number;
  take: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  search?: string;
  customerCompanyId?: string;
  company: string;
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  isSpecialRequest?: boolean;
}
const getHistory = async (payload: PayloadHistory) => {
  const query = Object.entries(payload).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      return `${acc}&${key}=${value}`;
    }
    return acc;
  }, '');

  return await request
    .get(`/cart/order?${query}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};
const getHistoryStore = async (userStaffId: string) => {
  return await request
    .get(`/cart/order/customer-company/${userStaffId}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};
export const historyServices = {
  getHistory,
  getHistoryStore,
};
