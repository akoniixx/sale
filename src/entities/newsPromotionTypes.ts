interface NewsPromotion {
    promotionId: string;
    company: string;
    promotionCode: string;
    promotionName: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    fileMemoPath: string | null;
    promotionImageFirst: string | null;
    promotionImageSecond: string;
    referencePromotion: any[]; // use a more specific type if you know the structure
    comment: string | null;
    promotionStatus: boolean;
    isDraft: boolean;
    isDelete: boolean;
    conditionDetail: ConditionDetail[];
    createdAt: string;
    updatedAt: string;
    createBy: string;
    updateBy: string;
    isShowPromotion: boolean;
    promotionSubject: string;
    promotionDetail: string;
    promotionNotiSubject: string;
    promotionNotiDetail: string;
    isShowShopApp: boolean;
    isShowSaleApp: boolean;
    isNotiFirstDate: boolean;
    notiFirstDate: string | null;
    isNotiSecondDate: boolean;
    notiSecondDate: string;
    isSendNAV: boolean;
  }
  
  interface ConditionDetail {
    typeMix: string;
    products: Product[];
    conditionFreebies: ConditionFreebies[];
  }
  
  interface Product {
    key: string;
    volume: string;
    baseUOM: string;
    company: string;
    saleUOM: string;
    typeMix: string;
    groupKey: number;
    packSize: string;
    updateBy: string;
    productId: string;
    saleUOMTH: string;
    unitPrice: string;
    commonName: string;
    createDate: string;
    packingUOM: string | null;
    updateDate: string;
    description: string | null;
    marketPrice: string;
    productName: string;
    qtySaleUnit: string;
    productGroup: string;
    productImage: string;
    productStatus: string;
    inventoryGroup: string | null;
    packingQtyUnit: string;
    productBrandId: string;
    productCodeNAV: string;
    productLocation: string;
    productStrategy: string;
    productBrandName: string;
    productCategoryId: string;
  }
  
  interface ConditionFreebies {
    freebies: Freebies[];
    quantity: string;
    saleUnit: string;
  }
  
  interface Freebies {
    key: string;
    volume?: string;
    baseUOM?: string;
    company: string;
    saleUOM?: string;
    packSize?: string;
    quantity: number;
    updateBy: string | null;
    productId?: string;
    saleUOMTH?: string;
    unitPrice?: string;
    commonName?: string;
    createDate: string;
    packingUOM?: string | null;
    updateDate: string;
    description: string | null;
    marketPrice?: string;
    productName: string;
    qtySaleUnit?: string;
    productGroup: string;
    productImage: string | null;
    productStatus: string;
    inventoryGroup?: string | null;
    packingQtyUnit?: string;
    productBrandId?: string;
    productCodeNAV?: string;
    productLocation?: string;
    productStrategy?: string;
    productBrandName?: string;
    productCategoryId?: string;
  }
  