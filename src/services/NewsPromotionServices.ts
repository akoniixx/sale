import { request } from "../config/request";


const getNewsPromotion = async (company: string, zone: string) => {
    return await request
      .get(
        `/master/promotion/promotion-active?company=${company}&zone=${zone}&isShowPromotion=true&isShowSaleApp=true`,
      )
      .then(res => res.data)
      .catch(err => console.log(err));
  };

  export const NewsPromotionService = {
    getNewsPromotion
} 