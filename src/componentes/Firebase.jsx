// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

/*
  Para implementar o login, vi que precisa exportar esse auth aqui
*/
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1C4dRPJTez4KpfUgiGDWdNasdHWbAnw8",
  authDomain: "urucum-react-project-v2.firebaseapp.com",
  databaseURL: "https://urucum-react-project-v2-default-rtdb.firebaseio.com",
  projectId: "urucum-react-project-v2",
  storageBucket: "urucum-react-project-v2.appspot.com",
  messagingSenderId: "1049579356887",
  appId: "1:1049579356887:web:07a59ef99247b6b6fbe692"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export const database = getDatabase(app);
export { auth, storage };