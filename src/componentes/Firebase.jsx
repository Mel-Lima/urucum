// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ4dM6zdmTc1YzSC7SeChfZ6UnAiiWkZ0",
  authDomain: "urucum-react-project-efd56.firebaseapp.com",
  projectId: "urucum-react-project-efd56",
  storageBucket: "urucum-react-project-efd56.firebasestorage.app",
  messagingSenderId: "957567489545",
  appId: "1:957567489545:web:d4759d45fc93891ab04ad8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);