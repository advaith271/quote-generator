import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { fetchRandomQuote, likeQuote } from "../services/api";
import { Quote } from "../types";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState<string | null>(null);

  const loadRandomQuote = async () => {
    setLoading(true);
    setLikeStatus(null);
    try {
      const data = await fetchRandomQuote();
      setQuote(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomQuote();
  }, []);

  const handleLike = async () => {
    if (!quote) return;
    try {
      const result = await likeQuote(quote.id);
      setLikeStatus(result.status);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to like quote");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Logout failed");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.quoteCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#4285F4" />
        ) : quote ? (
          <>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </>
        ) : (
          <Text style={styles.quoteText}>No quotes available</Text>
        )}
      </View>

      {likeStatus && (
        <Text style={styles.likeStatus}>
          {likeStatus === "liked" ? "Added to liked quotes!" : "Already liked!"}
        </Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.randomButton]}
          onPress={loadRandomQuote}
        >
          <Text style={styles.actionButtonText}>Random</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          disabled={!quote}
        >
          <Text style={styles.actionButtonText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likedListButton]}
          onPress={() => navigation.navigate("LikedQuotes")}
        >
          <Text style={styles.actionButtonText}>Liked Quotes</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#9C27B0" }]}
        onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.actionButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
  logoutText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  quoteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 500,
    width: "100%",
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  likeStatus: {
    marginTop: 12,
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 32,
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  randomButton: {
    backgroundColor: "#4285F4",
  },
  likeButton: {
    backgroundColor: "#EA4335",
  },
  likedListButton: {
    backgroundColor: "#34A853",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HomeScreen;