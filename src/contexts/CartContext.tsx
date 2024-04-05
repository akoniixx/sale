/* eslint-disable no-useless-catch */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {
  ProductFreebies,
  ProductType,
  PromotionTypeCart,
  SpFreebies,
} from '../entities/productType';
import { cartServices } from '../services/CartServices';
import { useAuth } from './AuthContext';
import { promotionTypeMap } from '../utils/mappingObj';
import { DataForOrderLoad, DataForReadyLoad } from '../entities/orderLoadTypes';
import { useOrderLoads } from './OrdersLoadContext';

interface Props {
  children: JSX.Element;
}
export interface newProductType extends ProductType {
  amount: number;
  order: number;
  discount: number;
  totalPrice?: number;
  saleUomTH?: string;
  saleUom?: string | null;
  specialRequestDiscount: number;
  specialRequest: number;
  price: number;

  orderProductPromotions: {
    promotionId?: string;
    isUse: boolean;
    company?: string;
    promotionCode?: string;
    promotionName?: string;
    promotionType?: string;
    startDate?: string;
    endDate?: string;
    fileMemoPath?: string | null;
    promotionImageFirst?: string;
    promotionImageSecond?: string;
    referencePromotion?: string | null;
    comment?: string | null;
    promotionStatus?: boolean;
    isDraft?: boolean;
    isDelete?: boolean;
    conditionDetail?: {
      productId: string;
      condition: {
        conditionDiscount: number;
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
      products: {
        productId: string;
      }[];
      conditionDiscount: number;
    }[];
  }[];
}
export interface CartDetailType {
  totalPrice: number;
  totalDiscount: number;
  price: number;
  orderProducts: any[];
  discount: number;
  specialRequestDiscount: number;
  specialRequestFreebies: SpFreebies[];
  coDiscount: number;
  coAmount: string;
  cashDiscount: number;
  allPromotions: PromotionTypeCart[];
  useCashDiscount: boolean;
  [key: string]: any;
}
interface ContextCart {
  cartList: newProductType[];
  cartApi: {
    getCartList: () => Promise<any>;
    getSelectPromotion: (cl: PromotionTypeCart[]) => Promise<any>;
    postCartItem: (
      cl: newProductType[],
      specialRequestFreebies?: SpFreebies[],
      newAllPromotion?: PromotionTypeCart[],
      DataForReadyLoad?:DataForReadyLoad[]
    ) => Promise<any>;
    postEditIsUseCod: ({ isUseCOD }: { isUseCOD: boolean }) => Promise<any>;
    postEditPaymentMethod: (
      paymentMethod: string,
      useCashDiscount: boolean,
    ) => Promise<any>;
  };
  setCartList: React.Dispatch<React.SetStateAction<newProductType[]>>;
  setCartDetail: React.Dispatch<React.SetStateAction<CartDetailType>>;
  cartDetail: CartDetailType;
  promotionListValue: string[];
  promotionList: any[];
  freebieListItem: any[];
  setPromotionList: React.Dispatch<React.SetStateAction<any>>;
  setFreebieListItem: React.Dispatch<React.SetStateAction<any>>;
  setPromotionListValue: React.Dispatch<React.SetStateAction<string[]>>;
  onMutateFreebie: (orderProducts: any) => void;
  cartOrderLoad:DataForOrderLoad[];
  setCartOrderLoad:React.Dispatch<React.SetStateAction<DataForOrderLoad[]>>
}
const CartContext = React.createContext<ContextCart>({
  cartList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},
  promotionListValue: [],
  promotionList: [],
  freebieListItem: [],
  setCartDetail: () => {
    return;
  },
  setPromotionListValue: () => [],
  setPromotionList: () => [],
  setFreebieListItem: () => [],
  cartDetail: {
    totalPrice: 0,
    totalDiscount: 0,
    price: 0,
    orderProducts: [],
    discount: 0,
    coAmount: '0',
    specialRequestDiscount: 0,
    coDiscount: 0,
    cashDiscount: 0,
    paymentMethod: 'CASH',
    allPromotions: [],
    specialRequestFreebies: [],
    useCashDiscount: false,
  },

  cartApi: {
    getCartList: async () => Promise.resolve(),
    postCartItem: async () =>
      Promise.resolve({
        cartList: [] as newProductType[],
        specialRequestFreebies: [] as ProductFreebies[],
        cartDetail: {} as CartDetailType,
        
      }),
    getSelectPromotion: async () => Promise.resolve(),
    postEditIsUseCod: async () => Promise.resolve(),
    postEditPaymentMethod: async () => Promise.resolve(),
  },
  onMutateFreebie: () => {
    return;
  },
  cartOrderLoad:[],
  setCartOrderLoad: ()=>{}
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const {
    state: { user },
  } = useAuth();
  const { 
    setDataReadyLoad,
  } = useOrderLoads();
  const [cartList, setCartList] = React.useState<newProductType[]>([]);
  const [promotionListValue, setPromotionListValue] = React.useState<string[]>(
    [],
  );
  const [cartDetail, setCartDetail] = React.useState<CartDetailType>({
    totalPrice: 0,
    totalDiscount: 0,
    price: 0,
    orderProducts: [],
    discount: 0,
    specialRequestDiscount: 0,
    coDiscount: 0,
    allPromotions: [],
    cashDiscount: 0,
    coAmount: '0',
    isUseCOD: false,
    specialRequestFreebies: [],
    useCashDiscount: false,
  });

  const [promotionList, setPromotionList] = React.useState<any>([]);
  const [freebieListItem, setFreebieListItem] = React.useState<any>([]);
  const [cartOrderLoad, setCartOrderLoad] = React.useState<DataForOrderLoad[]>([]);
  const value = React.useMemo(
    () => ({
      cartList,
      setCartList,
      setCartDetail,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartList],
  );

  const getSelectPromotion = React.useCallback(
    async (cl: PromotionTypeCart[]) => {
      const formatPromotion: {
        value: string;
        key: string;
        title: string;
        promotionType: string;
        isUse: boolean;
      }[] = [];
      const initialValue: string[] = [];

      for (let i = 0; i < cl.length; i++) {
        const promotion = cl[i];

        const isFreebie = promotion.promotionType === 'FREEBIES_NOT_MIX';
        if (promotion.isUse) {
          initialValue.push(promotion?.promotionId || '');
        }
        const promotionType = isFreebie ? 'ของแถมขั้นบันได' : 'ส่วนลดขั้นบันได';
        const title = `${promotionTypeMap(promotion.promotionType)} - ${
          promotion.promotionName
        }`;
        formatPromotion.push({
          value: promotion.promotionId || '',
          key: promotion.promotionId || '',
          title,
          promotionType: promotion.promotionType || '',
          isUse: promotion.isUse,
        });
      }

      setPromotionListValue(initialValue);
      setPromotionList(formatPromotion);

      return {
        promotionList: formatPromotion,
      };
    },
    [],
  );

  const cartApi = React.useMemo(() => {
    const postEditIsUseCod = async ({ isUseCOD }: { isUseCOD: boolean }) => {
      try {
        const orderProducts = cartList.map(item => {
          return {
            isUseCOD,
            productId: +item.productId,
            quantity: item.amount,
            shipmentOrder: item.order,
            orderProductPromotions: item.orderProductPromotions,
            specialRequest: item.specialRequest,
          };
        });
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        const payload: any = {
          isUseCOD,
          company: user?.company || '',
          userStaffId: user?.userStaffId || '',
          orderProducts,
          paymentMethod: cartDetail?.paymentMethod || '',
          customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
          allPromotions: cartDetail?.allPromotions || [],
          specialRequestFreebies: cartDetail?.specialRequestFreebies || [],
          useCashDiscount: cartDetail?.useCashDiscount || false,
        };

        const newData = await cartServices.postCart(payload);
        setCartDetail(prev => ({
          ...prev,
          ...newData,
          allPromotions: prev.allPromotions,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    const postEditPaymentMethod = async (
      paymentMethod: string,
      useCashDiscount: boolean,
    ) => {
      const orderProducts = cartList.map(item => {
        return {
          productId: +item.productId,
          quantity: item.amount,
          shipmentOrder: item.order,
          orderProductPromotions: item.orderProductPromotions,
          specialRequest: item.specialRequest,
        };
      });
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const payload: any = {
        paymentMethod,
        isUseCOD: !!cartDetail?.isUseCOD,
        company: user?.company || '',
        userStaffId: user?.userStaffId || '',
        orderProducts,
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
        allPromotions: cartDetail?.allPromotions || [],
        specialRequestFreebies: cartDetail?.specialRequestFreebies || [],
        useCashDiscount,
      };

      const data = await cartServices.postCart(payload);

      setCartDetail(prev => ({
        ...data,
        allPromotions: prev.allPromotions,
      }));
    };
    return {
      postEditIsUseCod,
      postEditPaymentMethod,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.userStaffId,
    cartList,
    cartDetail?.paymentMethod,
    cartDetail?.isUseCOD,
  ]);

  const getCartList = React.useMemo(() => {
    return async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const userStaffId = user?.userStaffId || '';

      const result = await cartServices.getCartList({
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
        userStaffId,
      });

      setCartDetail(result);

      const newFormat = (result?.orderProducts || [])
        .map((item: any): newProductType => {
          return {
            ...item,
            orderProductPromotions: item.orderProductPromotions || [],
            amount: item.quantity,
            order: item.shipmentOrder,
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            totalPrice: item.totalPrice,
            unitPrice: item.qtySaleUnit,
            baseUOM: item.baseUom,
            specialRequestFreebies: item.specialRequestFreebies,
          };
        })
        .filter((item: any) => !item.isFreebie);

        const data: DataForOrderLoad[] = result.orderProducts

        const processedData: DataForOrderLoad[] = data?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          saleUOMTH: item.saleUOMTH,
          productImage: item.productImage,
          baseUnitOfMeaTh: item.baseUnitOfMeaTh,
          productFreebiesId: item.productFreebiesId,
          isFreebie: item.isFreebie,
          
        }));

        const mergedProducts = processedData.reduce((acc: { [key: string]: DataForOrderLoad }, item) => {     
          const key = item.productId || `freebie_${item.productFreebiesId}` || 'undefined';
          if (acc[key]) {          
            acc[key].quantity += item.quantity;           
            if (item.isFreebie) {
              acc[key].freebieQuantity = (acc[key].freebieQuantity || 0) + item.quantity;
            }
          } else {           
            acc[key] = { ...item };           
            acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
          }       
          return acc;
        }, {});
        
        const mergedProductsArray = Object.values(mergedProducts);
        const orderLoads = result.orderLoads
      setCartOrderLoad(mergedProductsArray)
      setDataReadyLoad(orderLoads)
      setCartList(newFormat);
      return {
        ...result,
        orderProducts: newFormat,
        originProducts: result?.orderProducts,
      };
    };
  }, [user?.userStaffId]);

  const onMutateFreebie = (orderProducts: any) => {
    const freebieList = orderProducts
      .filter(
        (item: any) =>
          item?.isFreebie === true && item?.isSpecialRequestFreebie === false,
      )
      .map((el: any) => {
        if (el.productFreebiesId) {
          const newObj = {
            productName: el.productName,
            id: el.productFreebiesId,
            quantity: el.quantity,
            baseUnit: el.baseUnitOfMeaTh || el.baseUnitOfMeaEn,
            status: el.productFreebiesStatus,
            productImage: el.productFreebiesImage,
          };
          return newObj;
        } else {
          const newObj = {
            productName: el.productName,
            id: el.productId,
            quantity: el.quantity,
            baseUnit: el.baseUnitOfMeaTh || el.saleUOMTH || el.saleUOM || '',
            status: el.productStatus,
            productImage: el.productImage,
          };
          return newObj;
        }
      });
    setFreebieListItem(freebieList);
  };
  const postCartItem = React.useMemo(() => {
    return async (
      cl: newProductType[],
      specialRequestFreebies?: SpFreebies[],
      allPromotions?: PromotionTypeCart[],
      dataReadyLoad?:DataForReadyLoad[],
    ) => {
      try {
        const orderProducts = cl.map(item => {
          return {
            productId: +item.productId,
            quantity: item.amount,
            shipmentOrder: item.order,
            orderProductPromotions: item.orderProductPromotions,
            specialRequest: item.specialRequest,
          };
        });
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        const payload: any = {
          company: user?.company || '',
          userStaffId: user?.userStaffId || '',
          orderProducts,
          isUseCOD: !!cartDetail?.isUseCOD,
          customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
          paymentMethod: cartDetail?.paymentMethod || 'CASH',
          allPromotions: cartDetail?.allPromotions || [],
          specialRequestFreebies: cartDetail?.specialRequestFreebies || [],
          useCashDiscount: cartDetail?.useCashDiscount || false,
          orderLoads: dataReadyLoad||[]
        };

        if (specialRequestFreebies) {
          payload.specialRequestFreebies = specialRequestFreebies;
        }

        if (allPromotions) {
          payload.allPromotions = allPromotions;
        }

        const result = await cartServices.postCart(payload);
        const data: DataForOrderLoad[] = result.orderProducts

        const processedData: DataForOrderLoad[] = data?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          saleUOMTH: item.saleUOMTH,
          productImage: item.productImage,
          baseUnitOfMeaTh: item.baseUnitOfMeaTh,
          productFreebiesId: item.productFreebiesId,
          isFreebie: item.isFreebie,
          
        }));

        

        const mergedProducts = processedData.reduce((acc: { [key: string]: DataForOrderLoad }, item) => {     
          const key = item.productId || `freebie_${item.productFreebiesId}` || 'undefined';
          if (acc[key]) {          
            acc[key].quantity += item.quantity;           
            if (item.isFreebie) {
              acc[key].freebieQuantity = (acc[key].freebieQuantity || 0) + item.quantity;
            }
          } else {           
            acc[key] = { ...item };           
            acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
          }       
          return acc;
        }, {});
        
        const mergedProductsArray = Object.values(mergedProducts);
        setCartOrderLoad(mergedProductsArray)

        setDataReadyLoad(result.orderLoads)
        setCartDetail(result);
        const newFormat = (result?.orderProducts || [])
          .map((item: any): newProductType => {
            return {
              ...item,
              amount: item.quantity,
              order: item.shipmentOrder,
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              totalPrice: item.totalPrice,
              unitPrice: item.qtySaleUnit,
              baseUOM: item.baseUom,
            };
          })
          .filter((item: any) => !item.isFreebie);
        onMutateFreebie(result?.orderProducts);
        return {
          cartList: newFormat || [],
          cartDetail: result || {},
        };
      } catch (e) {
        throw e;
      }
    };
  }, [
    user?.userStaffId,
    user?.company,
    cartDetail?.paymentMethod,
    cartDetail?.isUseCOD,
    cartDetail?.allPromotions,
    cartDetail?.useCashDiscount,
    cartDetail?.specialRequestFreebies,
  ]);
  return (
    <CartContext.Provider
      value={{
        cartList: value.cartList,
        cartDetail,
        setCartList: value.setCartList,
        setCartDetail: value.setCartDetail,
        setPromotionListValue,
        setFreebieListItem,
        setPromotionList,
        promotionListValue,
        promotionList,
        freebieListItem,
        cartApi: {
          getCartList,
          postCartItem,
          getSelectPromotion,
          postEditIsUseCod: cartApi.postEditIsUseCod,
          postEditPaymentMethod: cartApi.postEditPaymentMethod,
        },
        onMutateFreebie,
        cartOrderLoad,
        setCartOrderLoad
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
