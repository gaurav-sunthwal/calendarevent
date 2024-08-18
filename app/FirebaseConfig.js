import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkR2dbvbchnrnXPOCkGOEOcsgeIgDCyn4",
  authDomain: "calender-74d1e.firebaseapp.com",
  projectId: "calender-74d1e",
  storageBucket: "calender-74d1e.appspot.com",
  messagingSenderId: "1005149979040",
  appId: "1:1005149979040:web:66ae74aeb1a479b99964c5",
  measurementId: "G-67X4NNQ1CJ",
};

// Initialize Firebase
export const Firebase_APP = initializeApp(firebaseConfig);
export const Firebase_AUTH = getAuth(Firebase_APP);
export const Firebase_DB = getFirestore(Firebase_APP);
