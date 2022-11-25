export interface ProductTypeParams {
  customerId?: string;
  company?: string;
  productBrandId?: string;
  isPromotion?: boolean;
  productCategoryId?: string;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  searchText?: string;
  page?: number;
  take?: number;
}
export interface ProductType {
  productId: string;
  company: string;
  productLocation: string;
  productBrandId: string;
  productCategoryId: string;
  productCodeNAV: string;
  productName: string;
  commonName: string;
  packSize: string;
  qtySaleUnit: number;
  baseUOM: string;
  packingUOM?: string | null;
  saleUOM: string;
  productGroup: string;
  inventoryGroup: string | null;
  productStrategy: string;
  marketPrice: string;
  unitPrice: string;
  productStatus: string;
  description: string | null;
  productImage: string;
  createDate: string;
  updateDate: string;
  updateBy: string;
}
export interface ProductCategory {
  productCategoryId: string;
  company: string;
  productCategoryImage: string;
  productCategoryName: string;
}
export interface ProductBrand {
  productBrandId: string;
  company: string;
  productBrandName: string;
  productBrandLogo: string | null;
}
export interface ProductSummary extends ProductType {
  productBrand?: ProductBrand;
  productCategory?: ProductCategory;
}
