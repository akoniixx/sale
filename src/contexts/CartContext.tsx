import * as React from 'react';
import { ProductType } from '../entities/productType';

interface Props {
  children: JSX.Element;
}
export interface newProductType extends ProductType {
  amount: number;
  order: number;
}
interface ContextCart {
  cartList: newProductType[];
  setCartList: React.Dispatch<React.SetStateAction<newProductType[]>>;
}
const CartContext = React.createContext<ContextCart>({
  cartList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartList, setCartList] = React.useState<newProductType[]>([]);
  const value = React.useMemo(() => ({ cartList, setCartList }), [cartList]);
  return (
    <CartContext.Provider
      value={{
        cartList: value.cartList,
        setCartList: value.setCartList,
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
