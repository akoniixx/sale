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
  zone?: string;
}
const getHistory = async (payload: PayloadHistory) => {
  const {
    status,
    company,
    page,
    take,
    customerCompanyId,
    endDate,

    search,
    startDate,
    zone,
  } = payload;
  const queryStatus = status?.reduce((acc, value) => {
    return `${acc}&status=${value}`;
  }, '');
  const payloadQuery = {
    page,
    take,
    company,
    zone,
  } as any;
  if (customerCompanyId) {
    payloadQuery.customerCompanyId = customerCompanyId;
  }
  if (search) {
    payloadQuery.search = search;
  }
  if (startDate) {
    payloadQuery.startDate = startDate;
  }
  if (endDate) {
    payloadQuery.endDate = endDate;
  }
  if (zone) {
    payloadQuery.customerZones = zone;
  }

  const query = new URLSearchParams(payloadQuery as any).toString();

  return await request
    .get(`/order-cart/order?${query}${queryStatus}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};
const getHistoryStore = async ({
  userStaffId,
  startDate,
  endDate,
  status,
  search,
  zone,
}: {
  userStaffId: string;
  startDate?: Date;
  endDate?: Date;
  status?: string[];
  search?: string;
  zone?: string[];
}) => {
  const queryStatus = status?.reduce((acc, value) => {
    return `${acc}&status=${value}`;
  }, '');
  const query = Object.entries({
    startDate,
    endDate,
    search,
    userStaffId,
  }).reduce((acc, [key, value]) => {
    if (value) {
      return `${acc}&${key}=${value}`;
    }
    return acc;
  }, '');

  let queryZone = '';
  if (zone) {
    zone.forEach((value, index) => {
      if (index === 0) {
        queryZone = `zones=${value}`;
      } else {
        queryZone = `${queryZone}&zones=${value}`;
      }
    });
  }

  return await request
    .post(
      `/order-cart/order/get-customer-company?${query}${queryStatus}${queryZone}`,
    )
    .then(res => {
      return res.data;
    })
    .catch(err => {
      throw err;
    });
};
export const historyServices = {
  getHistory,
  getHistoryStore,
};
