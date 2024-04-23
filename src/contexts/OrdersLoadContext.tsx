import React, { useState } from 'react';
import { DataForOrderLoad, DataForReadyLoad } from '../entities/orderLoadTypes';

interface Props {
  children: JSX.Element;
}
interface ContextOrderLoads {
  dataForLoad: DataForOrderLoad[];
  setDataForLoad: React.Dispatch<React.SetStateAction<any>>;
  headData: DataForOrderLoad[];
  setHeadData: React.Dispatch<React.SetStateAction<any>>;
  dollyData: DataForOrderLoad[];
  setDollyData: React.Dispatch<React.SetStateAction<any>>;
  currentList: SelectDataForOrderLoad[];
  setCurrentList: React.Dispatch<React.SetStateAction<any>>;
  dataReadyLoad: DataForReadyLoad[];
  setDataReadyLoad: React.Dispatch<React.SetStateAction<DataForReadyLoad[]>>;
}
interface SelectDataForOrderLoad extends DataForOrderLoad {
  maxQuantity?: number | undefined;
  isSelected?: boolean;
}

const OrderLoadsContext = React.createContext<ContextOrderLoads>({
  dataForLoad: [],
  setDataForLoad: () => {},
  headData: [],
  setHeadData: () => {},
  dollyData: [],
  setDollyData: () => {},
  currentList: [],
  setCurrentList: () => {},
  dataReadyLoad: [],
  setDataReadyLoad: () => {},
});

export const OrderLoadsProvider: React.FC<Props> = ({ children }) => {
  const [dataForLoad, setDataForLoad] = useState<DataForOrderLoad[]>([]);
  const [headData, setHeadData] = useState<DataForOrderLoad[]>([]);
  const [dollyData, setDollyData] = useState<DataForOrderLoad[]>([]);
  const [currentList, setCurrentList] = useState<SelectDataForOrderLoad[]>([]);
  const [dataReadyLoad, setDataReadyLoad] = useState<DataForReadyLoad[]>([]);

  return (
    <OrderLoadsContext.Provider
      value={{
        dataForLoad: dataForLoad,
        setDataForLoad: setDataForLoad,
        headData: headData,
        setHeadData: setHeadData,
        dollyData: dollyData,
        setDollyData: setDollyData,
        currentList: currentList,
        setCurrentList: setCurrentList,
        dataReadyLoad: dataReadyLoad,
        setDataReadyLoad: setDataReadyLoad,
      }}>
      {children}
    </OrderLoadsContext.Provider>
  );
};

export const useOrderLoads = () => {
  const context = React.useContext(OrderLoadsContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
