import { initializeApp } from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

// Firebase yapılandırma bilgilerinizi buraya ekleyin
const firebaseConfig = {
  apiKey: "AIzaSyDMzVL_yhnjHI2jy0VsbXJ0B0ak7YCcukU",
  authDomain: "stoktakip-199e1.firebaseapp.com",
  databaseURL: "https://stoktakip-199e1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stoktakip-199e1",
  storageBucket: "stoktakip-199e1.firebasestorage.app",
  messagingSenderId: "1085157092534",
  appId: "1:1085157092534:web:192049db181ecf9517ca17",
  measurementId: "G-FYV5TVSSR1"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Realtime Database referansını al
export const db = database;

export default app; 