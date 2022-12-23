import { request } from '../../config/request';

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
const createOrder = async (order: Order) => {
  const response = await request.post('/cart/api/v1/order', order);
  return response.data;
};
const getOrderById = async (orderId: string) => {
  const response = await request.get(`/cart/api/v1/order/${orderId}`);
  return response.data;
};
export const orderServices = {
  createOrder,
  getOrderById,
};
