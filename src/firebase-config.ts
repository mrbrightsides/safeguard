import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestFCMToken = async () => {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BBeXm8m_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0_X0' // This is a placeholder, user needs to provide their own or I can use a generic one if possible, but usually it's project specific.
    });
    if (token) {
      console.log('FCM Token:', token);
      return token;
    }
    return null;
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
