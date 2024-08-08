
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAomGPzcp7otYgjcLs9VQcOhfYKNS33uvY",
  authDomain: "movie-ticket-booking-bf3a2.firebaseapp.com",
  projectId: "movie-ticket-booking-bf3a2",
  storageBucket: "movie-ticket-booking-bf3a2.appspot.com",
  messagingSenderId: "257757996224",
  appId: "1:257757996224:web:e0a97082e4e165f0dab925",
  measurementId: "G-09QTKZB98P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth= getAuth(app);
export const db = getFirestore(app);
export default app;
