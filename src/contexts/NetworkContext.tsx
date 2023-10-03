import React, {createContext, useState, useEffect, useContext} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {AppState} from 'react-native';

type NetworkContextType = {
  isConnected: boolean;
  onReconnect: () => Promise<void>;
  appState: string;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('Next AppState is: ', nextAppState);
        setAppState(nextAppState);
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  const onReconnect = async () => {
    await NetInfo.fetch().then(state => {
      setIsConnected(!!state.isConnected);
    });
  };

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });

    // Fetch the current network state once
    NetInfo.fetch().then(state => {
      setIsConnected(!!state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{isConnected, onReconnect, appState}}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
