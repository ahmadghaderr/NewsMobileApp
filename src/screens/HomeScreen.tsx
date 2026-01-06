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
import { fetchNews, setSearchText, setCurrentPage } from "../redux/newSlice";
import { AppDispatch, RootState } from "../redux/store";
import { NewsArticle } from "../types/newsArticle";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const isDark = colorScheme === "dark";

  const { articles, loading, error, searchText, currentPage } = useSelector(
    (state: RootState) => state.news
  );

  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    setLocalSearch(searchText === "latest" ? "" : searchText || "");
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = localSearch.trim() === "" ? "latest" : localSearch;
      if (query !== searchText) {
        dispatch(setSearchText(query));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localSearch, searchText, dispatch]);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch, searchText, currentPage]);

  const renderNewsItem = ({ item }: { item: NewsArticle }) => (
    <View style={[styles.newsCard, isDark && styles.darkCard]}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text
          style={[styles.newsTitle, isDark && styles.whiteText]}
          numberOfLines={3}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.newsDescription, isDark && styles.lightText]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
        <Text style={styles.newsSource}>{item.source?.name}</Text>
      </View>
    </View>
  );

  const buttonColor = isDark ? "#FFFFFF" : "#1A1A1A";
  const paginationBg = isDark
    ? "rgba(30, 30, 30, 0.95)"
    : "rgba(255, 255, 255, 0.92)";

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.homeText, isDark && styles.whiteText]}>
        News Home
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search articles..."
          value={localSearch}
          onChangeText={setLocalSearch}
          style={[styles.searchInput, isDark && styles.darkInput]}
          placeholderTextColor={isDark ? "#ccc" : "#999"}
        />
      </View>

      {loading && articles.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error && articles.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchNews())}
          >
            <Text style={styles.retryText}>Please Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No results found.</Text>
          }
        />
      )}

      {articles.length > 0 && (
        <View
          style={[styles.paginationBottom, { backgroundColor: paginationBg }]}
        >
          <View style={styles.buttonWrapper}>
            {currentPage > 1 && (
              <TouchableOpacity
                onPress={() => dispatch(setCurrentPage(currentPage - 1))}
              >
                <Text style={[styles.paginationText, { color: buttonColor }]}>
                  ← Page {currentPage - 1}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={() => dispatch(setCurrentPage(currentPage + 1))}
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
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  darkContainer: { backgroundColor: "#121212" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  homeText: {
    fontSize: 28,
    fontWeight: "800",
    marginVertical: 16,
    textAlign: "center",
    color: "#1A1A1A",
  },
  whiteText: { color: "#FFFFFF" },
  lightText: { color: "#AAA" },
  searchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  searchInput: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  darkInput: { backgroundColor: "#1E1E1E", borderColor: "#333", color: "#FFF" },
  newsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  darkCard: { backgroundColor: "#1E1E1E" },
  newsImage: { width: "100%", height: 210, backgroundColor: "#E1E1E1" },
  newsContent: { padding: 16 },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 24,
  },
  newsDescription: { fontSize: 14, color: "#555", marginTop: 8 },
  newsSource: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 12,
    textTransform: "uppercase",
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
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#CCC",
  },
  buttonWrapper: { flex: 1 },
  paginationText: { fontSize: 15, fontWeight: "700", paddingVertical: 8 },
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
  retryText: { color: "#FFFFFF", fontWeight: "600" },
});
