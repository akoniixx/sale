import { request } from '../../config/request';

const getDealerZoneById = async (saleId: number) => {
  const { data } = await request.get(
    `/auth/customer/get-dealer-zone/${saleId}`,
  );
  return data;
};
export const customerServices = { getDealerZoneById };
