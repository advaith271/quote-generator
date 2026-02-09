import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchLikedQuotes } from "../services/api";
import { LikedQuote } from "../types";

const LikedQuotesScreen: React.FC = () => {
  const [likedQuotes, setLikedQuotes] = useState<LikedQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikedQuotes = async () => {
      try {
        const data = await fetchLikedQuotes();
        setLikedQuotes(data);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to load liked quotes");
      } finally {
        setLoading(false);
      }
    };
    loadLikedQuotes();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (likedQuotes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No liked quotes yet.</Text>
        <Text style={styles.emptySubtext}>
          Go back and like some quotes!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={likedQuotes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.quoteText}>"{item.quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {item.quote.author}</Text>
            <Text style={styles.likedAt}>
              Liked on {new Date(item.liked_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  likedAt: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});

export default LikedQuotesScreen;
