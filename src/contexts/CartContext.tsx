import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  children: JSX.Element;
}
interface ContextCart {
  cartList: any;
  setCartList: React.Dispatch<any>;
}
const CartContext = React.createContext<ContextCart>({
  cartList: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCartList: () => {},
});

export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cartList, setCartList] = React.useState<any>([]);
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
