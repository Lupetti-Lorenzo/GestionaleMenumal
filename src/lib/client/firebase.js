import {  initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWmWp-mlD244-ZL9QE1fIjzU0-fy0gIfs",
  authDomain: "gestionalemenumal.firebaseapp.com",
  projectId: "gestionalemenumal",
  storageBucket: "gestionalemenumal.appspot.com",
  messagingSenderId: "490959051864",
  appId: "1:490959051864:web:352225ca2e362be8213e2d"
};

// ... Firebase Config ...
// Initialize Firebase
export const getFirebase = () => {
  let app
  if (getApps().length) 
    app = getApp()
    else {
      app = initializeApp(firebaseConfig);
    }
    const auth = getAuth(app);
    return { app, auth }
}
