import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ProductType } from '../entities/productType';
import { cartServices } from '../services/CartServices';

interface Props {
  children: JSX.Element;
}
export interface newProductType extends ProductType {
  amount: number;
  order: number;
  totalPrice?: number;
}
interface ContextCart {
  cartList: newProductType[];
  cartApi: {
    getCartList: () => Promise<void>;
    postCartItem: (cl: newProductType[]) => Promise<void>;
  };
  setCartList: React.Dispatch<React.SetStateAction<newProductType[]>>;
}
const CartContext = React.createContext<ContextCart>({
  cartList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},
  cartApi: {
    getCartList: async () => Promise.resolve(),
    postCartItem: async () => Promise.resolve(),
  },
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartList, setCartList] = React.useState<newProductType[]>([]);
  const value = React.useMemo(() => ({ cartList, setCartList }), [cartList]);
  const cartApi = React.useMemo(() => {
    const getCartList = async () => {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const user = await AsyncStorage.getItem('user');
      const userStaffId = JSON.parse(user || '')?.userStaffId;
      const result = await cartServices.getCartList({
        customerCompanyId: JSON.parse(customerCompanyId || '') || '',
        userStaffId,
      });
      const newFormat = result.data.order_products.map(
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
      setCartList(newFormat);
    };
    const postCartItem = async (cl: newProductType[]) => {
      try {
        const orderProducts = cl.map(item => {
          return {
            productId: +item.productId,
            quantity: item.amount,
            shipmentOrder: item.order,
          };
        });
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        const user = await AsyncStorage.getItem('user');
        const userParse = JSON.parse(user || '');
        const payload = {
          company: userParse?.company || '',
          userStaffId: userParse?.userStaffId || '',
          orderProducts,
          customerCompanyId: JSON.parse(customerCompanyId || '') || 0,
          paymentMethod: 'CASH',
        };
        await cartServices.postCart(payload);
      } catch (e) {
        console.log(e);
      }
    };
    return {
      getCartList,
      postCartItem,
    };
  }, []);
  return (
    <CartContext.Provider
      value={{
        cartList: value.cartList,
        setCartList: value.setCartList,
        cartApi,
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
