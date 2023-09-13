import { request } from '../../config/request';

interface CartItemType {
  company: string;
  customerCompanyId: string | number;
  isUseCod?: boolean;
  orderProducts: {
    productId: number;
    quantity: number;
    shipmentOrder: number;
    orderProductPromotions?: {
      promotionId: string;
      isUse: boolean;
    }[];
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
    .post(`/order-cart/cart/sale`, payload)
    .then(res => res.data)
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
const getCartList = async ({ userStaffId, customerCompanyId }: GetCartType) => {
  return await request
    .get(
      `/order-cart/cart/sale?userStaffId=${userStaffId}&customerCompanyId=${customerCompanyId}`,
    )
    .then(res => {
      console.log(res)
      return (res.data)})
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
export const cartServices = {
  postCart,
  getCartList,
};
