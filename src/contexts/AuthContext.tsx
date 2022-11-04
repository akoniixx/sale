/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

interface Props {
  children: JSX.Element;
}

interface State {
  isLoading: boolean;

  user: null | any;
}

interface Action {
  type: string;
  user?: any;
}

interface Context {
  authContext: {
    getProfileAuth: () => Promise<any>;
  };
  state: State;
}

const initialState = {
  user: null,
  isLoading: true,
};

const AuthContext = React.createContext<Context>({
  authContext: {
    getProfileAuth: Promise.resolve,
  },
  state: initialState,
});

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'GET_ME':
        return {
          ...prevState,
          user: action.user,
        };

      default:
        return prevState;
    }
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );

  const authContext = React.useMemo(
    () => ({
      getProfileAuth: async () => {
        try {
          const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';

          // const data = await ProfileDatasource.getProfile(dronerId);
          // dispatch({type: 'GET_ME', user: data});
          // return data;
        } catch (e: any) {
          console.log(e);
        }
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={{ authContext, state }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Context => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth can be use in AuthContext only');
  }
  return context;
};
