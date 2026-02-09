import React, {createContext,useContext,useEffect,useState} from "react";
import { onAuthStateChanged,User } from "firebase/auth";
import {auth} from "../../firebaseConfig";
import{
    signInWithGoogle as googleSignIn,
    logout as firebaseLogout,
} from "../services/auth";

interface AuthContextType{
    user: User|null;
    loading: boolean;
    signInWithGoogle: ()=>Promise<void>;
    logout: ()=>Promise<void>;
}

const AuthContext=createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async()=>{},
    logout: async()=>{},
});

export const useAuth=()=>useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user,setUser]=useState<User|null>(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,
            (firebaseUser)=>{
                setUser(firebaseUser);
                setLoading(false);
            });
        return unsubscribe;
    }, []);
    
    const signInWithGoogle=async()=>{
        await googleSignIn();
    };

    const logout=async()=>{
        await firebaseLogout();
    };

    return (
        <AuthContext.Provider value={{user,loading,signInWithGoogle,logout}}>
            {children}
        </AuthContext.Provider>
    );
};



