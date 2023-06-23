import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ProductType, PromotionTypeCart } from '../entities/productType';
import { cartServices } from '../services/CartServices';
import { useAuth } from './AuthContext';

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
    }[];
    [key: string]: any;
  }[];
}
interface CartDetailType {
  totalPrice: number;
  totalDiscount: number;
  price: number;
  orderProducts: any[];
  discount: number;
  specialRequestDiscount: number;
  coDiscount: number;
  coAmount: string;
  cashDiscount: number;
  allPromotions: PromotionTypeCart[];
  [key: string]: any;
}
interface ContextCart {
  cartList: newProductType[];
  cartApi: {
    getCartList: () => Promise<any>;
    getSelectPromotion: (cl: PromotionTypeCart[]) => Promise<any>;
    postCartItem: (
      cl: newProductType[],
      newAllPromotion?: PromotionTypeCart[],
    ) => Promise<any>;
    postEditIsUseCod: ({ isUseCOD }: { isUseCOD: boolean }) => Promise<any>;
    postEditPaymentMethod: (paymentMethod: string) => Promise<any>;
  };
  setCartList: React.Dispatch<React.SetStateAction<newProductType[]>>;
  cartDetail: CartDetailType;
  promotionListValue: string[];
  promotionList: any[];
  freebieListItem: any[];
  setPromotionList: React.Dispatch<React.SetStateAction<any>>;
  setFreebieListItem: React.Dispatch<React.SetStateAction<any>>;
  setPromotionListValue: React.Dispatch<React.SetStateAction<string[]>>;
}
const CartContext = React.createContext<ContextCart>({
  cartList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},
  promotionListValue: [],
  promotionList: [],
  freebieListItem: [],
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
  },

  cartApi: {
    getCartList: async () => Promise.resolve(),
    postCartItem: async () =>
      Promise.resolve({
        cartList: [] as newProductType[],
        cartDetail: {} as CartDetailType,
      }),
    getSelectPromotion: async () => Promise.resolve(),
    postEditIsUseCod: async () => Promise.resolve(),
    postEditPaymentMethod: async () => Promise.resolve(),
  },
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const {
    state: { user },
  } = useAuth();
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
  });

  const [promotionList, setPromotionList] = React.useState<any>([]);
  const [freebieListItem, setFreebieListItem] = React.useState<any>([]);
  const value = React.useMemo(
    () => ({
      cartList,
      setCartList,
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
        const title = `${promotionType} - ${promotion.promotionName}`;
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
    const postEditPaymentMethod = async (paymentMethod: string) => {
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
          };
        })
        .filter((item: any) => !item.isFreebie);

      setCartList(newFormat);

      return {
        ...result,
        orderProducts: newFormat,
      };
    };
  }, [user?.userStaffId]);
  const postCartItem = React.useMemo(() => {
    return async (
      cl: newProductType[],
      allPromotions?: PromotionTypeCart[],
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
        };

        if (allPromotions) {
          payload.allPromotions = allPromotions;
        }
        console.log('payload', JSON.stringify(payload, null, 2));

        const result = await cartServices.postCart(payload);
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

        const freebieList = (result.orderProducts || [])
          .filter((item: any) => item.isFreebie)
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
                baseUnit: el.saleUOMTH || el.saleUOM || '',
                status: el.productStatus,
                productImage: el.productImage,
              };
              return newObj;
            }
          });
        setFreebieListItem(freebieList);

        return {
          cartList: newFormat || [],
          cartDetail: result || {},
        };
      } catch (e) {
        console.log(e);
      }
    };
  }, [
    user?.userStaffId,
    user?.company,
    cartDetail?.paymentMethod,
    cartDetail?.isUseCOD,
  ]);
  return (
    <CartContext.Provider
      value={{
        cartList: value.cartList,
        cartDetail,
        setCartList: value.setCartList,
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
