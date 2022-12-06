import { request } from '../../config/request';
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
}: ProductTypeParams) => {
  const payload: ProductTypeParams = {
    page,
    take,
    customerId,
    company,
    isPromotion,
    productBrandId,
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

  const genQuery = Object.keys(payload)
    .map(key => `${key}=${payload[key as keyof ProductTypeParams]}`)
    .join('&');
  return await request
    .get(`/master/product?${genQuery}`)
    .then(res => res.data)
    .catch(err => console.log(err));
};
const getProductById = async (id: string) => {
  return await request
    .get(`/master/product/${id}`)
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

export const productServices = {
  getAllProducts,
  getProductById,
  getProductBrand,
  getProductCategory,
};
