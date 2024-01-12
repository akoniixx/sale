import { AxiosRequestConfig } from 'axios';
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

export interface payloadUploadFile{
  orderId:string
  updateBy:string
  action: 'CREATE'|'DELETE'
  orderFileId?:string,
  files:Asset
}
const createOrder = async (order: Order) => {
  const response = await request.post('/order-cart/order', order);
  return response.data;
};
const getOrderById = async (orderId: string) => {
  const response = await request.get(`/order-cart/order/${orderId}`);
  return response.data;
};

const uploadFile =async (data: FormData) => {
  
  const response = await uploadFileInstance.post(`/order-cart/order/update-file`,data)
  return response.data
}
export const orderServices = {
  createOrder,
  getOrderById,
  uploadFile
  
};
