import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa la funcionalidad de autenticación

const firebaseConfig = {
  apiKey: "AIzaSyC7-xLGm9TiL7-5IE8ugCZVXfQkaPRACNQ",
  authDomain: "darayal.firebaseapp.com",
  projectId: "darayal",
  storageBucket: "darayal.firebasestorage.app",
  messagingSenderId: "469345502610",
  appId: "1:469345502610:web:953e1e49ed907358622d4b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la autenticación de Firebase
const auth = getAuth(app);

export { app, auth };
