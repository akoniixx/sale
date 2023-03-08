import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ProductType, PromotionTypeCart } from '../entities/productType';
import { cartServices } from '../services/CartServices';

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
  },
});

export const CartProvider: React.FC<Props> = ({ children }) => {
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
      const freebieListItem: {
        productName: string;
        id: string;
        quantity: number;
        baseUnit: string | undefined;
        status: string | undefined;
        productImage: string | undefined;
      }[] = [];
      const initialValue: string[] = [];
      for (let i = 0; i < cl.length; i++) {
        const promotion = cl[i];

        const isFreebie = promotion.promotionType === 'FREEBIES_NOT_MIX';
        if (isFreebie && promotion.isUse) {
          const freebieList = promotion.conditionDetail.condition;
          freebieList.forEach((f: any) => {
            const freebies = f.freebies;
            freebies.forEach((fr: any) => {
              if (fr.productFreebiesId) {
                const newObj = {
                  productName: fr.productName,
                  id: fr.productFreebiesId,
                  quantity: fr.quantity,
                  baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn,
                  status: fr.productFreebiesStatus,
                  productImage: fr.productFreebiesImage,
                };
                freebieListItem.push(newObj);
              } else {
                const newObj = {
                  productName: fr.productName,
                  id: fr.productId,
                  quantity: fr.quantity,
                  baseUnit: fr.saleUOMTH || fr.saleUOM || '',
                  status: fr.productStatus,
                  productImage: fr.productImage,
                };

                freebieListItem.push(newObj);
              }
            });
          });
        }
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
      console.log('initialValue', JSON.stringify(initialValue, null, 2));
      // for (let j = 0; j < promotionList.length; j++) {
      //   const promotion = promotionList[j];
      //   const isFreebie = promotion.promotionType === 'FREEBIES_NOT_MIX';
      //   if (isFreebie && promotion.isUse) {
      //     const freebieList = promotion.conditionDetail.condition;
      //     freebieList.forEach((f: any) => {
      //       const freebies = f.freebies;
      //       freebies.forEach((fr: any) => {
      //         if (fr.productFreebiesId) {
      //           const newObj = {
      //             productName: fr.productName,
      //             id: fr.productFreebiesId,
      //             quantity: fr.quantity,
      //             baseUnit: fr.baseUnitOfMeaTh || fr.baseUnitOfMeaEn,
      //             status: fr.productFreebiesStatus,
      //             productImage: fr.productFreebiesImage,
      //           };
      //           freebieListItem.push(newObj);
      //         } else {
      //           const newObj = {
      //             productName: fr.productName,
      //             id: fr.productId,
      //             quantity: fr.quantity,
      //             baseUnit: fr.saleUOMTH || fr.saleUOM || '',
      //             status: fr.productStatus,
      //             productImage: fr.productImage,
      //           };

      //           freebieListItem.push(newObj);
      //         }
      //       });
      //     });
      //   }
      //   if (promotion.isUse) {
      //     initialValue.push(promotion.promotionId || '');
      //   }

      //   const promotionType = isFreebie
      //     ? 'ของแถมขั้นบันได'
      //     : 'ส่วนลดขั้นบันได';
      //   const title = `${promotionType} - ${promotion.promotionName}`;
      //   formatPromotion.push({
      //     value: promotion.promotionId || '',
      //     key: promotion.promotionId || '',
      //     title,
      //     promotionType: promotion.promotionType || '',
      //     isUse: promotion.isUse,
      //   });
      // }
      // const newPromotion: PromotionTypeCart[] = cl.reduce((acc: any, cur) => {
      //   if (
      //     cur.orderProductPromotions &&
      //     cur.orderProductPromotions.length > 0
      //   ) {
      //     return [...acc, ...cur.orderProductPromotions];
      //   }

      //   return [...acc];
      // }, []);

      // const formatPromotion = newPromotion.map((el, idx) => {
      //   const promotionType =
      //     el.promotionType === 'FREEBIES_NOT_MIX'
      //       ? 'ของแถมขั้นบันได'
      //       : 'ส่วนลดขั้นบันได';
      //   const title = `${idx + 1}.  ${promotionType} - ${el.promotionName}`;
      //   return {
      //     value: el.promotionId,
      //     key: el.promotionId,
      //     title,
      //     promotionType: el.promotionType,
      //     isUse: el.isUse,
      //   };
      // });

      // initialValue.map(el => {
      //   const findFreebie = newPromotion.find(el2 => {
      //     return (
      //       el2.promotionId === el && el2.promotionType === 'FREEBIES_NOT_MIX'
      //     );
      //   });
      //   if (findFreebie) {
      //     findFreebie?.conditionDetail.condition.map(i => {
      //       i.freebies.map(j => {
      //         if (j.productFreebiesId) {
      //           const newObj = {
      //             productName: j.productName,
      //             id: j.productFreebiesId,
      //             quantity: j.quantity,
      //             baseUnit: j.baseUnitOfMeaTh || j.baseUnitOfMeaEn,
      //             status: j.productFreebiesStatus,
      //             productImage: j.productFreebiesImage,
      //           };
      //           freebieListItem.push(newObj);
      //         } else {
      //           const newObj = {
      //             productName: j.productName,
      //             id: j.productId,
      //             quantity: j.quantity,
      //             baseUnit: j.saleUOMTH || j.saleUOM || '',
      //             status: j.productStatus,
      //             productImage: j.productImage,
      //           };

      //           freebieListItem.push(newObj);
      //         }
      //       });
      //     });
      //   }
      // });
      setPromotionListValue(initialValue);
      setPromotionList(formatPromotion);

      setFreebieListItem(freebieListItem);
      return {
        promotionList: formatPromotion,
        freebieListItem,
      };
    },
    [],
  );

  const cartApi = React.useMemo(() => {
    const getCartList = async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const user = await AsyncStorage.getItem('user');
      const userStaffId = JSON.parse(user || '')?.userStaffId;

      const result = await cartServices.getCartList({
        customerCompanyId: JSON.parse(customerCompanyId || '') || '',
        userStaffId,
      });
      setCartDetail(result);
      const newFormat = (result.orderProducts || []).map(
        (item: any): newProductType => {
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
        },
      );

      setCartList(newFormat);

      return {
        ...result,
        orderProducts: newFormat,
      };
    };

    const postCartItem = async (
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
        const user = await AsyncStorage.getItem('user');
        const userParse = JSON.parse(user || '');
        const payload: any = {
          company: userParse?.company || '',
          userStaffId: userParse?.userStaffId || '',
          orderProducts,
          customerCompanyId: JSON.parse(customerCompanyId || '') || 0,
          paymentMethod: 'CASH',
        };
        if (allPromotions) {
          payload.allPromotions = allPromotions;
        }
        const result = await cartServices.postCart(payload);
        setCartDetail(result);
        const newFormat = (result.orderProducts || []).map(
          (item: any): newProductType => {
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
          },
        );

        return {
          cartList: newFormat || [],
          cartDetail: result || {},
        };
      } catch (e) {
        console.log(e);
      }
    };

    return {
      getCartList,
      postCartItem,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          getCartList: cartApi.getCartList,
          postCartItem: cartApi.postCartItem,
          getSelectPromotion,
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
