// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore,collection} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOAd1oRvscIK8v6IxMuQI0-nTYrWmAaIc",
  authDomain: "fir-mobile-project-4830f.firebaseapp.com",
  projectId: "fir-mobile-project-4830f",
  storageBucket: "fir-mobile-project-4830f.firebasestorage.app",
  messagingSenderId: "858705714130",
  appId: "1:858705714130:web:408a9fa04fb91eca6e060b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth =initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db =getFirestore(app);

export const usersRef =collection(db,'users');
export const roomRef =collection(db,'rooms');