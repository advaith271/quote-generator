import React, {useState} from "react";
import{
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen: React.FC=()=>{
    const {signInWithGoogle}=useAuth();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState<string|null>(null);

    const handleSignIn=async()=>{
        setLoading(true);
        setError(null);
        try{
            await signInWithGoogle();
        }
        catch(err:any){
            setError(err.message || "Sign in failed.");
        }
        finally{
            setLoading(false);
        }
    };

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quotes</Text>
      <Text style={styles.subtitle}>Get inspired every day</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );   
};

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title:{
        fontSize: 36,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 48,
    },
    button: {
        backgroundColor: "#4285F4",
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
        minWidth: 220,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    error: {
        color: "red",
        marginTop: 16,
        fontSize: 14,
    },
});

export default LoginScreen;