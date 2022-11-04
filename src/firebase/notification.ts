import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const credentials = {
  databaseURL: '',
  clientId: '', // iOS
  appId: '',
  apiKey: '',
  storageBucket: '',
  messagingSenderId: '',
  projectId: '',
};

export const firebaseInitialize = async () => {
  await firebase.initializeApp(credentials);
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }
}

export const getFCMToken = async () => {
  const token = await messaging().getToken();
  await AsyncStorage.setItem('fcmtoken', token);
};

export const fcmOnListen = () => {
  messaging().onMessage(async remoteMessage => {
    // page.current = remoteMessage.notification.body;
  });
};
