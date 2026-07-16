import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TERI_API_KEY",
  authDomain: "TERA_AUTH_DOMAIN",
  projectId: "TERA_PROJECT_ID",
  storageBucket: "TERA_BUCKET",
  messagingSenderId: "TERA_SENDER_ID",
  appId: "TERA_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
