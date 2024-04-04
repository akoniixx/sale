import { distanceRequest } from '../../config/request';

const getProvinceList = async () => {
  return await distanceRequest
    .get(`/location/province`)
    .then(res => res.data)
    .catch(err => {
      return err;
    });
};
const getDistrictList = async (provinceId: string) => {
  return await distanceRequest
    .get(`/location/district/${provinceId}`)
    .then(res => res.data)
    .catch(err => {
      return err;
    });
};
const getSubDistrictList = async (districtId: string) => {
  return await distanceRequest
    .get(`/location/subdistrict/${districtId}`)
    .then(res => res.data)
    .catch(err => {
      return err;
    });
};
const getPostcodeList = async ({
  provinceId,
  districtId,
  subDistrictId,
}: {
  provinceId: string;
  districtId: string;
  subDistrictId: string;
}) => {
  return await distanceRequest
    .get(`/location/address/${provinceId}/${districtId}/${subDistrictId}`)
    .then(res => res.data)
    .catch(err => {
      return err;
    });
};

export const distanceServices = {
  getProvinceList,
  getDistrictList,
  getSubDistrictList,
  getPostcodeList,
};
