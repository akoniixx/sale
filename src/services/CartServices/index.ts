import { request } from '../../config/request';
import { DataForReadyLoad } from '../../entities/orderLoadTypes';

export interface CartItemType {
  company: string;
  customerCompanyId: string | number;
  isUseCod?: boolean;
  orderProducts: {
    productId: number | string;
    quantity: number;
    shipmentOrder: number;
    specialRequest: number;
  }[];
  paymentMethod?: string;
  customerName?: string;
  customerNo?: string;
  userShopId: string;
  orderLoads?:DataForReadyLoad[]
  userStaffId: string
}
interface GetCartType {
  userStaffId?: string;
  customerCompanyId?: number;
}
const postCart = async (payload: CartItemType) => {
  return await request
    .post(`/order-cart/cart/sale`, payload)
    .then(res => res.data)
    .catch(err => {throw(err.response.data)});
};
const getCartList = async ({ userStaffId, customerCompanyId }: GetCartType) => {
  return await request
    .get(
      `/order-cart/cart/sale?userStaffId=${userStaffId}&customerCompanyId=${customerCompanyId}`,
    )
    .then(res => {
      return (res.data)})
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};
const postReorder =async (payload:
  {
    company:string,
    userStaffId:string,
    orderId:string
    isForceReorder:boolean
  }) => {
    return await request
    .post('/order-cart/cart/shop-reorder', payload)
    .then(res => res.data)
    .catch(err => err.response.data);
}
export const cartServices = {
  postCart,
  getCartList,
  postReorder
};
