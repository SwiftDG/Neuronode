import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGBdxcaBSWvy2JJr_2tf_4vHjlZ-19lNE",
  authDomain: "neuronode-2c654.firebaseapp.com",
  projectId: "neuronode-2c654",
  storageBucket: "neuronode-2c654.firebasestorage.app",
  messagingSenderId: "640614330695",
  appId: "1:640614330695:web:be5ecd1db5e07b65f81c62",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
