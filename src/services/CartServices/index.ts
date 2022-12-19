import { request } from '../../config/request';

interface CartItemType {
  company: string;
  customerCompanyId: string;
  isUseCod?: boolean;
  orderProducts: {
    productId: number;
    quantity: number;
    shipmentOrder: number;
  }[];
  paymentMethod?: string;
  saleCoRemark?: string;
  specialRequestRemark?: string;
  userStaffId: string;
}
const postCart = async (payload: CartItemType) => {
  console.log('payload', JSON.stringify(payload, null, 2));
  return await request
    .post(`/cart/api/v1/cart`, payload)
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
export const cartServices = {
  postCart,
};
