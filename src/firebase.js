// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGMaUCHx2za37vVTCxxXuiEfqhj3ddgFU",
  authDomain: "pizza-planet-e71db.firebaseapp.com",
  projectId: "pizza-planet-e71db",
  storageBucket: "pizza-planet-e71db.appspot.com",
  messagingSenderId: "471732265113",
  appId: "1:471732265113:web:541fa9b4aa29e4b29b9808"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const dbPizzasRef = collection(db, "pizzas");
export const dbOrdersRef = collection(db, "orders");
export const dbUsersRef = collection(db, "users");