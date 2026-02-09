import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LikedQuotesScreen from "../screens/LikedQuotesScreen";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="LikedQuotes"
              component={LikedQuotesScreen}
              options={{
                headerShown: true,
                title: "Liked Quotes",
                headerStyle: { backgroundColor: "#f5f5f5" },
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: "Profile",
                headerStyle: { backgroundColor: "#f5f5f5" },
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
