import { request, uploadFileInstance } from '../../config/request';

export interface OtherAddressType {
  customerId: number;
  customerCompanyId: number;
  address: string;
  provinceId: string;
  province: string;
  districtId: string;
  district: string;
  subdistrictId: string;
  subdistrict: string;
  postcode: string;

  receiver: string;
  telephone: string;
  updateBy: string;
}
interface UploadFileType {
  file: any;
  updateBy: string;
  customerOtherAddressId: string;
}
const createOtherAddress = async (data: OtherAddressType) => {
  return await request
    .post('/auth/customer-other-address/add-customer-other-address', {
      ...data,
    })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

const uploadFile = async ({
  file,
  updateBy,
  customerOtherAddressId,
}: UploadFileType) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.fileName,
  });
  formData.append('updateBy', updateBy);
  formData.append('customerOtherAddressId', customerOtherAddressId);

  return await uploadFileInstance
    .post('/auth/file-other-address/add-other-address-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};
const getOtherAddressList = async (data: {
  customerId: number;
  customerCompanyId: number;
}) => {
  return await request
    .get('/auth/customer-other-address/get-customer-other-address', {
      params: {
        customerId: data.customerId,
        customerCompanyId: data.customerCompanyId,
      },
    })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};
const getById = async (id: string) => {
  return await request
    .get(`/auth/customer-other-address/get-one-customer-other-address/${id}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};

const deleteOtherAddressById = async (id: string) => {
  return await request
    .delete(`/auth/customer-other-address/delete-customer-other-address/${id}`)
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
};
export const otherAddressServices = {
  createOtherAddress,
  uploadFile,
  getOtherAddressList,
  getById,
  deleteOtherAddressById,
};
