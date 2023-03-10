
import { useState, createContext, useEffect } from "react";
import { auth, db, storage } from '../services/firebaseconnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";



export const AuthContext = createContext({});

function AuthProvider({children}){

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        function loadUser(){
            const storageUser = localStorage.getItem("@Chamados");

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
            setLoading(false);
        }
        
        loadUser();
    }, [])

    async function signIn(email, password){
        setLoadingAuth(true);
        await signInWithEmailAndPassword(auth,email, password)
        .then(async (value)=> {
            let uid = value.user.uid
            
            const docRef = doc(db, "users", uid);

            const docSnapshot = await getDoc(docRef);

            let data = {
                uid: uid,
                nome: docSnapshot.data().name,
                email: value.user.email,
                avatarUrl: docSnapshot.data().avatarUrl
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem vindo(a) de volta");
            navigate("/dashboard");
        })
        .catch((error)=>{
            console.log(error)
            toast.error("Ops, algo deu errado, tente novamente mais tarde.")
        })
    }
    async function signUp(name, email, password){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        
        .then( async (value)=>{

            let uid = value.user.uid;

            await setDoc(doc(db, "users", uid), {
                nome: name,
                avatarUrl: null
            })
            .then(()=>{
                
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success("Seja Bem vindo!!")
                navigate('/dashboard');
            })
        })
        .catch((error)=>{
            console.log(error)
            toast.error("Parace que algo deu errado, tente novamente.")
            setLoadingAuth(false)
        })
        
        
    }

    function storageUser(data){
        localStorage.setItem('@Chamados', JSON.stringify(data));
    }

    async function logout(){
        await signOut(auth);
        localStorage.removeItem("@Chamados");
        setUser(null);
    }

    return(
        <AuthContext.Provider
            value={{
                signed: !!user,  //retorna um booleano true or false se tiver algum usuario
                user,
                signIn, 
                signUp,
                logout,
                storageUser,
                loadingAuth,
                loading,
                setUser

            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;