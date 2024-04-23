import { navRequest, request } from '../../config/request';
import { ProductTypeParams } from '../../entities/productType';

const getAllProducts = async ({
  page = 1,
  take = 10,
  customerId,
  company,
  isPromotion = false,
  productBrandId,
  productCategoryId,
  sortField,
  sortDirection,
  searchText,
  customerCompanyId,
}: ProductTypeParams) => {
  const payload: ProductTypeParams = {
    page,
    take,
    company,
    productBrandId,
    customerCompanyId,
    isPromotion,
    productStatus: 'ACTIVE',
  };

  if (productCategoryId) {
    payload.productCategoryId = productCategoryId;
  }
  if (sortField) {
    payload.sortField = sortField;
  }
  if (sortDirection) {
    payload.sortDirection = sortDirection;
  }
  if (searchText) {
    payload.searchText = searchText;
  }
  // console.log('payload', JSON.stringify(payload, null, 2));
  const genQuery = Object.keys(payload)
    .map(key => `${key}=${payload[key as keyof ProductTypeParams]}`)
    .join('&');

  return await request
    .get(`/master/product?${genQuery}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getProductById = async (id: string, customerCompanyId: string) => {
  return await request
    .get(
      `/master/product/product-by-id?productId=${id}&customerCompanyId=${customerCompanyId}&productStatus=ACTIVE`,
    )
    .then(res => res.data)
    .catch(err => console.log(err));
};
const getProductCategory = async (company?: string) => {
  return await request
    .get(`/master/product-category?company=${company}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};
const getProductBrand = async (company?: string) => {
  return await request
    .get(`/master/product-brand?company=${company}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};

const getProductFree = async (payload: any) => {
  const { ...rest } = payload;

  const query = Object.entries(rest).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      return `${acc}&${key}=${value}`;
    }
    return acc;
  }, '');

  return await request
    .get(`/master/product-freebies?${query}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};

const getBaseFreebies = async (company: string, itemNo: string) => {
  return await navRequest
    .get(`/nav/uom-nav?company=${company}&itemNo=${itemNo}`)
    .then(res => res.data)
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getAllNameProduct = async (company: string) => {
  return await request
    .get(`/master/product/product-name/${company}`)
    .then(res => res.data)
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const productServices = {
  getAllProducts,
  getProductById,
  getProductBrand,
  getProductCategory,
  getProductFree,
  getBaseFreebies,
  getAllNameProduct,
};
