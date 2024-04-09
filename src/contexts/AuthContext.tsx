/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthServices } from '../services/AuthServices';
import { navigate } from '../navigations/RootNavigator';
import { userServices } from '../services/UserServices';
import { firebaseInitialize, getFCMToken } from '../firebase/notification';
import messaging from '@react-native-firebase/messaging';

interface Props {
  children: JSX.Element;
}
interface UserType {
  company?: string;
  email?: string;
  notiStatus?: boolean;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  role?: string;
  status?: string;
  telephone?: string;
  userStaffId?: string;
  zone?: string | string[];
  profileImage?: string;
}

interface State {
  isLoading: boolean;

  user?: null | UserType;
  companyDetail?: {
    companyId: string;
    companyCode: string;
    companyNameEn: string;
    companyNameTh: string;
    companyLogo: string;
    companyType: string;
  };
}

interface Action {
  type: string;
  user?: UserType | null;
  companyDetail?: {
    companyId: string;
    companyCode: string;
    companyNameEn: string;
    companyNameTh: string;
    companyLogo: string;
    companyType: string;
  };
}

interface Context {
  authContext: {
    getUser: (userStaffId?: string) => Promise<any>;
    login: (user: any) => Promise<any>;
    logout: () => Promise<void>;
  };
  state: State;
  dispatch: React.Dispatch<Action>;
}

const initialState = {
  user: null,
  isLoading: true,
  companyDetail: {
    companyId: '',
    companyCode: '',
    companyNameEn: '',
    companyNameTh: '',
    companyLogo: '',
    companyType: '',
  },
};

const AuthContext = React.createContext<Context>({
  authContext: {
    getUser: Promise.resolve,
    login: () => Promise.resolve(),
    logout: Promise.resolve,
  },
  state: initialState,
  dispatch: () => null,
});

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'GET_ME':
        return {
          ...prevState,
          user: action.user,
          companyDetail: action.companyDetail,
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
          companyDetail: action.companyDetail,
        };

      case 'SET_PROFILE_IMAGE':
        if (!action.user) {
          return prevState;
        }
        return {
          ...prevState,
          user: {
            ...prevState.user,
            profileImage: action.user.profileImage,
          },
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
      getUser: async (id?: string) => {
        try {
          const userStaffId = (await AsyncStorage.getItem('userStaffId')) || '';
          if (!userStaffId && !id) {
            return;
          }

          const user = await userServices.getUserProfile(id ? id : userStaffId);
          const companyDetail = await AsyncStorage.getItem('companyDetail');
          if (user) {
            await AsyncStorage.setItem('role', user?.role || 'SALE');
            dispatch({
              type: 'GET_ME',
              user: {
                ...user,
              },
              companyDetail: JSON.parse(companyDetail || '{}'),
            });
          }
        } catch (e: any) {
          console.log(e);
        }
      },
      login: async (payload: any) => {
        try {
          const { data } = await AuthServices.verifyOtp(payload);
          if (data) {
            const token = await messaging().getToken();
            await AsyncStorage.setItem('fcmtoken', token);
            await AsyncStorage.setItem('token', data.accessToken);
            await AsyncStorage.setItem('userStaffId', data.data.userStaffId);
            await AsyncStorage.setItem('company', data.data.company);
            await AsyncStorage.setItem('zone', data.data.zone);
            await AsyncStorage.setItem('role', data.data?.role || 'SALE');

            await AsyncStorage.setItem(
              'companyDetail',
              JSON.stringify(data.company || {}),
            );
            const fcmtoken = await AsyncStorage.getItem('fcmtoken');
            if (fcmtoken) {
              try {
                await userServices.updateFcmToken({
                  deviceToken: fcmtoken,
                  userStaffId: data.data.userStaffId,
                  token: data.accessToken,
                });
              } catch (e) {
                console.log('e firebase, :>>', e);
              }
            }
            dispatch({
              type: 'LOGIN',
              user: {
                ...data.data,
                zone:
                  data.data.role === 'SALE MANAGER'
                    ? data.data.zone.split(',')
                    : data.data.zone,
              },
              companyDetail: data.company,
            });
            return data;
          }
        } catch (e: any) {
          console.log(e);
        }
      },
      logout: async () => {
        const fmctoken = await AsyncStorage.getItem('fcmtoken');
        await userServices.removeDeviceToken(fmctoken).then(async res => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('fcmtoken');
          await AsyncStorage.removeItem('company');
          await AsyncStorage.removeItem('zone');
          dispatch({ type: 'LOGOUT' });
        });

        /*  navigate('LoginScreen'); */
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={{ authContext, state, dispatch }}>
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
