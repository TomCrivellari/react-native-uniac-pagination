import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyCmmB1-HsBCBpxoAJ2jSgXG0xJOfR1XKaw',
  authDomain: 'devmobileuniac.firebaseapp.com',
  projectId: 'devmobileuniac',
  storageBucket: 'devmobileuniac.firebasestorage.app',
  messagingSenderId: '426358270428',
  appId: '1:426358270428:web:2732ab5b68990f9cf48719',
};

export const app = initializeApp(firebaseConfig);

// o firestore dá erro se algum campo vier undefined, assim ele só ignora o campo
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

// no celular o login fica salvo no AsyncStorage, senão a pessoa teria que
// entrar de novo toda vez que abrisse o app. no navegador o firebase já salva sozinho
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
