import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNews } from "../services/api.services";
import { NewsArticle } from "../types/newsArticle";

interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
};

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await getNews();
  return response.data.articles;
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch news";
      });
  },
});

export default newsSlice.reducer;