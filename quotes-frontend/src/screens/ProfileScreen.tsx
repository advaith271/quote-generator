import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { fetchProfile } from "../services/api";
import { Profile } from "../types";

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile?.display_name || "No name"}</Text>
      <Text style={styles.email}>{profile?.email}</Text>
      <Text style={styles.date}>
        Member since: {profile ? new Date(profile.first_login).toLocaleDateString() : ""}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
});

export default ProfileScreen;
