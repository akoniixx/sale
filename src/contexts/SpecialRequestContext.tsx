import React = require('react');
import { createContext } from 'react';
import { SpecialRequestServices } from '../services/SpecialRequestServices';
import { useAuth } from './AuthContext';
interface SpecialRequestContextType {
  countSpecialRequest?: number;
  getSpecialRequestList: () => Promise<void>;
}

interface Props {
  children: JSX.Element;
}

interface OrderProduct {
  discount: number;
  productId: number;
  productLocation: string;
  productBrandId: number;
  productCategoryId: number;
  productCodeNAV: string;
  productName: string;
  commonName: string;
  packSize: string;
  qtySaleUnit: number;
  baseUOM: string;
  packingUOM: string | null;
  saleUOM: string;
  saleUOMTH: string;
  marketPrice: string;
  productGroup: string;
  inventoryGroup: string | null;
  productStrategy: string;
  productImage: string;
  orderProductId: string;
  orderId: string;
  productFreebiesId: string | null;
  quantity: number;
  shipmentOrder: number;
  isFreebie: boolean;
  isSpecialRequestFreebie: boolean;
  specialRequest: number;
  price: number;
  specialRequestDiscount: number;
  coDiscount: number;
  totalPrice: number;
  productPromotionCode: string | null;
  productFreebiesCodeNAV: string | null;
  baseUnitOfMeaEn: string | null;
  baseUnitOfMeaTh: string | null;
  productFreebiesStatus: string | null;
  description: string | null;
  productFreebiesImage: string | null;
}

export interface SpecialRequestType {
  orderId: string;
  company: string;
  orderNo: string;
  spNo: string;
  userStaffId: string;
  userShopId: string;
  customerCompanyId: number;
  customerName: string;
  customerNo: string;
  userStaffName: string | null;
  userShopName: string | null;
  customerZone: string;
  status: string;
  paymentMethod: string;
  isUseCOD: boolean;
  soNo: string | null;
  navNo: string | null;
  paidStatus: string;
  saleCoRemark: string | null;
  specialRequestRemark: string | null;
  cancelRemark: string | null;
  deliveryDest: string;
  deliveryAddress: string;
  deliveryRemark: string;
  numberPlate: string | null;
  price: number;
  discount: number;
  cashDiscount: number;
  specialRequestDiscount: number;
  coDiscount: number;
  totalDiscount: number;
  totalPrice: number;
  vatPercentage: number;
  vat: number;
  createAt: string;
  updateAt: string;
  updateBy: string;
  orderProducts: OrderProduct[];
}

const SpecialRequestContext = createContext<SpecialRequestContextType>(
  {} as SpecialRequestContextType,
);

export const SpecialRequestProvider: React.FC<Props> = ({
  children,
}: Props) => {
  const {
    state: { user },
  } = useAuth();
  const [countSpecialRequest, setCountSpecialRequest] = React.useState(0);

  const getSpecialRequestList = React.useCallback(async () => {
    try {
      if (!user?.company) {
        return;
      }
      const result = await SpecialRequestServices.getListSpecialRequest({
        page: 1,
        take: 10,
        company: user?.company as 'ICPL' | 'ICPI' | 'ICPF',
        customerZones: user?.zone as string[],
      });
      setCountSpecialRequest(result.count || 0);
    } catch (error) {
      console.error(error);
    }
  }, [user?.company, user?.zone]);

  React.useEffect(() => {
    if (user?.role === 'SALE MANAGER') {
      getSpecialRequestList();
    }
  }, [getSpecialRequestList, user?.role]);

  return (
    <SpecialRequestContext.Provider
      value={{ countSpecialRequest, getSpecialRequestList }}>
      {children}
    </SpecialRequestContext.Provider>
  );
};

export const useSpecialRequest = () => {
  const context = React.useContext(SpecialRequestContext);
  if (!context) {
    throw new Error(
      'useSpecialRequest must be used within a SpecialRequestProvider',
    );
  }
  return context;
};
