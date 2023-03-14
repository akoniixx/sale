/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthServices } from '../services/AuthServices';
import { navigate } from '../navigations/RootNavigator';

interface Props {
  children: JSX.Element;
}
interface UserType {
  company: string;
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  role: string;
  status: string;
  telephone: string;
  userStaffId: string;
  zone: string;
  profileImage?: string;
}

interface State {
  isLoading: boolean;

  user?: null | UserType;
}

interface Action {
  type: string;
  user?: UserType | null;
}

interface Context {
  authContext: {
    getUser: () => Promise<any>;
    login: (user: any) => Promise<any>;
    logout: () => Promise<void>;
  };
  state: State;
}

const initialState = {
  user: null,
  isLoading: true,
};

const AuthContext = React.createContext<Context>({
  authContext: {
    getUser: Promise.resolve,
    login: () => Promise.resolve(),
    logout: Promise.resolve,
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
      case 'LOGOUT':
        return {
          ...prevState,
          user: null,
        };

      case 'LOGIN':
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
      getUser: async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          if (user) {
            dispatch({ type: 'GET_ME', user: JSON.parse(user) });
          }
        } catch (e: any) {
          console.log(e);
        }
      },
      login: async (payload: any) => {
        try {
          const { data } = await AuthServices.verifyOtp(payload);
          await AsyncStorage.setItem('token', data.accessToken);
          await AsyncStorage.setItem('user', JSON.stringify(data.data));
          dispatch({ type: 'LOGIN', user: data.data });
          return data;
        } catch (e: any) {
          console.log(e);
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
          navigate('LoginScreen');
        } catch (e) {
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
