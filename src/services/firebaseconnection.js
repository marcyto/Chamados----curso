import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyCoyaVFikdhzmsHvu244MAao9RojzAJuyk",
    authDomain: "sistema2-f5e3f.firebaseapp.com",
    projectId: "sistema2-f5e3f",
    storageBucket: "sistema2-f5e3f.appspot.com",
    messagingSenderId: "494747051647",
    appId: "1:494747051647:web:42f9ad8a68f2b7fea4814a",
    measurementId: "G-WYS9LW2HWL"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };