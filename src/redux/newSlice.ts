import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNews } from "../services/api.services";
import { NewsArticle, NewsState } from "../types/newsArticle";
import { RootState } from "./store";


const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
  searchText: undefined,
  currentPage: 1,
};

export const fetchNews = createAsyncThunk<NewsArticle[], void, { state: RootState }>(
  "news/fetchNews",
  async (_, { getState }) => {
    const { searchText, currentPage } = getState().news;
    const response = await getNews(currentPage, searchText);
    return response.data.articles;
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
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

export const { setSearchText, setCurrentPage } = newsSlice.actions;
export default newsSlice.reducer;