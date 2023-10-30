import { request } from '../../config/request';

const getDealerZoneById = async (saleId: string) => {
  const { data } = await request.get(
    `/auth/customer/get-dealer-zone/${saleId}`,
  );
  return data;
};

const getCustomer = async (customerId:string,company:string) => {
  return await request
    .get(
      `/auth/customer/get-customer?customerId=${customerId}&company=${company}`,
    )
    .then(res => {
      return (res.data)})
    .catch(err => console.log(JSON.stringify(err.response.data, null, 2)));
};


export const customerServices = { getDealerZoneById,getCustomer };
