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
interface GetCartType {
  userStaffId?: string;
  customerCompanyId?: number;
}
const postCart = async (payload: CartItemType) => {
  return await request
    .post(`/cart/api/v1/cart`, payload)
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
const getCartList = async ({ userStaffId, customerCompanyId }: GetCartType) => {
  return await request
    .get(`/cart/api/v1/cart/${userStaffId}/${customerCompanyId}`)
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
export const cartServices = {
  postCart,
  getCartList,
};
