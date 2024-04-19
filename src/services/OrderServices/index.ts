import { request, uploadFileInstance } from '../../config/request';
import { Asset } from 'react-native-image-picker';

interface Order {
  company: string;
  customerCompanyId: string;
  customerName: string;
  customerNo: string;
  isUseCod?: boolean;
  orderProducts: {
    productId: number;
    quantity: number;
    shipmentOrder: number;
  }[];
  paymentMethod?: string;
  saleCoRemark?: string | null;
  specialRequestRemark?: string | null;
  userStaffId: string;
}

export interface payloadUploadFile {
  orderId: string;
  updateBy: string;
  action: 'CREATE' | 'DELETE';
  orderFileId?: string;
  files: Asset;
}
const createOrder = async (order: Order) => {
  const response = await request.post('/order-cart/order', order);
  return response.data;
};
const getOrderById = async (orderId: string) => {
  const response = await request.get(`/order-cart/order/${orderId}`);
  return response.data;
};

const uploadFile = async (data: FormData) => {
  const response = await uploadFileInstance
    .post(`/order-cart/order/update-file`, data)
    .catch(err => {
      throw err;
    });
  return response.data;
};
const postStatusOrder = async (payload: {
  orderId: string;
  status: string;
  paidStatus?: string;
  cancelRemark?: string;
  soNo: string | null;
  navNo: string | null;
  updateBy: string;
}) => {
  return await request
    .post('/order-cart/order/update-order-status', payload)
    .then(res => res.data)
    .catch(err => err);
};
const getOrderSearchSuggestions = async ({
  searchText,
  status,
}: {
  searchText: string;
  status: string[];
}) => {
  const payload = {} as any;
  if (status) {
    payload['status'] = status;
  }
  if (searchText) {
    payload['search'] = searchText;
  }
  const query = new URLSearchParams(payload).toString();
  return await request
    .get(`/order-cart/order/search/search-name?${query}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      throw err;
    });
};

export const orderServices = {
  createOrder,
  getOrderById,
  uploadFile,
  postStatusOrder,
  getOrderSearchSuggestions,
};
