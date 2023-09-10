import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const credentials = {
  databaseURL: '',
  clientId:
    '124740181518-44bsqer9kq6bhr2lcfifkvtpckcab53a.apps.googleusercontent.com', // iOS
  appId: '1:124740181518:ios:cdb8970e802ff00dd1a65f',
  apiKey: 'AIzaSyCLENnnqxy8UIqcplgLktpAHvN7oMDHRkE',
  storageBucket: 'sellcoda-sale-v2.appspot.com',
  messagingSenderId: '124740181518',
  projectId: 'sellcoda-sale-v2',
};
const credentialsProd = {
  databaseURL: '',
  clientId:
    '124740181518-8cju3oqb2olhn37nah87t7ddq0lh4um2.apps.googleusercontent.com',
  appId: '1:124740181518:ios:81d2155652d1f456d1a65f',
  apiKey: 'AIzaSyCLENnnqxy8UIqcplgLktpAHvN7oMDHRkE',
  storageBucket: 'sellcoda-sale-v2.appspot.com',
  messagingSenderId: '124740181518',
  projectId: 'sellcoda-sale-v2',
};

export const firebaseInitialize = async () => {
  if (!firebase.apps.length) {
    await firebase.initializeApp(credentials);
  } else {
    firebase.app();
  }
};

/* export const getFCMToken = async () => {
  const token = await messaging().getToken();
  await AsyncStorage.setItem('fcmtoken', token);
}; */

export const getFCMToken = async () => {
  try {
    const localFcmToken = await AsyncStorage.getItem('fcmtoken');
    if (localFcmToken) {
      return;
    }
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmtoken', token);
    messaging().setBackgroundMessageHandler(async remote => {});
  } catch (err) {
    console.log(err);
  }
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    await getFCMToken();
    // console.log('Authorization status:', authStatus);
  }
}

export const fcmOnListen = () => {
  messaging().onMessage(async remoteMessage => {
    // page.current = remoteMessage.notification.body;
  });
};
