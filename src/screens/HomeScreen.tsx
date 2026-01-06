import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../redux/newSlice";
import { AppDispatch, RootState } from "../redux/store";
import { NewsArticle } from "../types/newsArticle";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();

  const { articles, loading, error } = useSelector(
    (state: RootState) => state.news
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const query = searchText.toLowerCase().trim();

  const filteredArticles = articles.filter((item) => {
    return (
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.source?.name?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  );

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderNewsItem = ({ item }: { item: NewsArticle }) => (
    <View style={styles.newsCard}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.newsSource}>{item.source?.name}</Text>
      </View>
    </View>
  );

  if (loading && articles.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchNews())}
        >
          <Text style={styles.retryText}>Please Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isDark = colorScheme === "dark";
  const buttonColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const paginationBg = isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.92)";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.homeText}>News Home</Text>

      <TextInput
        placeholder="Search articles..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor={isDark ? "#ccc" : "#999"}
      />

      <FlatList
        data={paginatedArticles}
        renderItem={renderNewsItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found.</Text>
        }
      />

      {filteredArticles.length > 0 && (
        <View style={[styles.paginationBottom, { backgroundColor: paginationBg }]}>
          <View style={styles.buttonWrapper}>
            {currentPage > 1 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCurrentPage(currentPage - 1)}
              >
                <Text style={[styles.paginationText, { color: buttonColor }]}>
                  ← Page {currentPage - 1}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonWrapper}>
            {currentPage < totalPages && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCurrentPage(currentPage + 1)}
              >
                <Text
                  style={[
                    styles.paginationText,
                    { color: buttonColor, textAlign: "right" },
                  ]}
                >
                  Page {currentPage + 1} →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeText: {
    fontSize: 28,
    fontWeight: "800",
    marginVertical: 16,
    textAlign: "center",
    color: "#1A1A1A",
  },
  searchInput: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  newsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  newsImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#E1E1E1",
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 24,
  },
  newsDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },
  newsSource: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paginationBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  paginationText: {
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});