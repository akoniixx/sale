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
  customerCompanyId?: string;
  productStatus?: 'ACTIVE' | 'INACTIVE';
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
  saleUOMTH: string | null;
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
  promotion?: PromotionType[];
}
export interface PromotionType {
  promotionId: string;
  company: string;
  promotionCode: string;
  promotionName: string;
  promotionType: string;
  startDate: string;
  endDate: string;
  fileMemoPath: string | null;
  promotionImageFirst: string;
  promotionImageSecond: string;
  referencePromotion: string | null;
  comment: string | null;
  promotionStatus: boolean;
  isDraft: boolean;
  isDelete: boolean;
  conditionDetail: {
    conditionDiscount: {
      quantity: string
      saleUnit: string
      discountPrice: string
      saleUnitDiscount: string
    }[]
    productId: string;
    condition: {
      freebies: {
        key: string;
        baseUOM: string;
        company: string;
        product: {
          key: string;
          baseUOM: string;
          company: string;
          saleUOM: string;
          packSize: string;
          productId: string;
          saleUOMTH: string | null;
          unitPrice: string;
          commonName: string;
          createDate: string;
          packingUOM: string | null;
          updateDate: string;
          description: string | null;
          marketPrice: string;
          productName: string;
          qtySaleUnit: number;
          productGroup: string;
          productImage: string;
          productStatus: string;
          inventoryGroup: string | null;
          productBrandId: string;
          productCodeNAV: string;
          productLocation: string;
          productStrategy: string;
          productCategoryId: string;
          updateBy: string | null;
          baseUnitOfMeaEn?: string;
          baseUnitOfMeaTh?: null;
          productFreebiesId?: string;
          productFreebiesImage?: string;
          productFreebiesStatus?: string;
          productFreebiesCodeNAV?: string;
        };
        saleUOM: string;
        packSize: string;
        quantity: number;
        productId: string;
        saleUOMTH: string | null;
        unitPrice: string;
        commonName: string;
        createDate: string;
        packingUOM: null;
        updateDate: string;
        description: string;
        marketPrice: string;
        productName: string;
        qtySaleUnit: number;
        productGroup: string;
        productImage: string;
        productStatus: string;
        inventoryGroup: string | null;
        productBrandId: string;
        productCodeNAV: string;
        productLocation: string;
        productStrategy: string;
        productCategoryId: string;
        updateBy: string | null;
        baseUnitOfMeaEn?: string;
        baseUnitOfMeaTh?: null;
        productFreebiesId?: string;
        productFreebiesImage?: string;
        productFreebiesStatus?: string;
        productFreebiesCodeNAV?: string;
      }[];
      quantity: string;
      saleUnit: string;
      discountPrice: string;
      saleUnitDiscount: string;
      saleUnitDiscountTH: string | null;
      saleUnitTH: string | null;
    }[];
  }[];
}
export interface PromotionTypeCart {
  promotionId: string | undefined;
  isUse: boolean;
  promotionName: string;
  promotionType: string;
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
