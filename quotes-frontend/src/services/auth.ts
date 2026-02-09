import{
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    User,
} from "firebase/auth"
import {auth} from "../../firebaseConfig"

const googleProvider=new GoogleAuthProvider()

export const signInWithGoogle = async (): Promise<User> => {
    const result=await signInWithPopup(auth,googleProvider);
    return result.user;
};

export const logout=async(): Promise<void>=>{
    await signOut(auth);
};

export const getIDToken=async(): Promise<string|null>=>{
    const user=auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
};