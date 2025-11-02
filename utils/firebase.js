import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCggeaOb5bakl94c6t3nh10qBXGEKSvGdk",
  authDomain: "hr-admin-panel-7cd88.firebaseapp.com",
  projectId: "hr-admin-panel-7cd88",
  storageBucket: "hr-admin-panel-7cd88.firebasestorage.app",
  messagingSenderId: "247142794090",
  appId: "1:247142794090:web:504abaf63a77145be31b13",
  measurementId: "G-GD08TS8DSH",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
