import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    "projectId": "smartsphere-citizen-hub",
    "appId": "1:1037123833094:web:38a1c1bea6ce642146e287",
    "storageBucket": "smartsphere-citizen-hub.firebasestorage.app",
    "apiKey": "AIzaSyCDrolPpz_FxAutjc14MSgWXL8nrzuwugg",
    "authDomain": "smartsphere-citizen-hub.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "1037123833094"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
