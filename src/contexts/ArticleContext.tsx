"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type { ArticleDisplayData } from "../components/articles/ArticleDisplayCard";

interface ArticleState {
  articles: ArticleDisplayData[];
  featuredArticle: ArticleDisplayData | null;
  total: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  currentOffset: number;
}

type ArticleAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_ARTICLES";
      payload: {
        articles: ArticleDisplayData[];
        total: number;
        hasMore: boolean;
      };
    }
  | {
      type: "APPEND_ARTICLES";
      payload: { articles: ArticleDisplayData[]; hasMore: boolean };
    }
  | { type: "SET_FEATURED_ARTICLE"; payload: ArticleDisplayData | null }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_OFFSET"; payload: number }
  | { type: "RESET_PAGINATION" };

const initialState: ArticleState = {
  articles: [],
  featuredArticle: null,
  total: 0,
  hasMore: false,
  loading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "All Categories",
  currentOffset: 0,
};

function articleReducer(
  state: ArticleState,
  action: ArticleAction
): ArticleState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_ARTICLES":
      return {
        ...state,
        articles: action.payload.articles,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null,
        currentOffset: action.payload.articles.length,
      };
    case "APPEND_ARTICLES":
      return {
        ...state,
        articles: [...state.articles, ...action.payload.articles],
        hasMore: action.payload.hasMore,
        loading: false,
        currentOffset: state.currentOffset + action.payload.articles.length,
      };
    case "SET_FEATURED_ARTICLE":
      return { ...state, featuredArticle: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_OFFSET":
      return { ...state, currentOffset: action.payload };
    case "RESET_PAGINATION":
      return { ...state, currentOffset: 0, hasMore: false };
    default:
      return state;
  }
}

interface ArticleContextType {
  state: ArticleState;
  loadArticles: () => Promise<void>;
  loadMoreArticles: () => Promise<void>;
  searchArticles: (searchTerm: string) => Promise<void>;
  setSelectedCategory: (category: string) => void;
  getFilteredArticles: () => ArticleDisplayData[];
}

const ArticleContext = createContext<ArticleContextType | null>(null);

export function useArticles() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticles must be used within an ArticleProvider");
  }
  return context;
}

interface ArticleProviderProps {
  children: React.ReactNode;
}

export function ArticleProvider({ children }: ArticleProviderProps) {
  const [state, dispatch] = useReducer(articleReducer, initialState);

  const loadArticles = useCallback(
    async (reset = false) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      if (reset) {
        dispatch({ type: "RESET_PAGINATION" });
      }

      try {
        const offset = reset ? 0 : state.currentOffset;
        const params = new URLSearchParams({
          limit: "20",
          offset: offset.toString(),
          ...(state.searchTerm && { search: state.searchTerm }),
        });

        const response = await fetch(`/api/articles?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await response.json();

        if (reset || offset === 0) {
          dispatch({
            type: "SET_ARTICLES",
            payload: {
              articles: data.articles,
              total: data.total,
              hasMore: data.hasMore,
            },
          });

          // Set featured article (first article)
          if (data.articles.length > 0) {
            dispatch({
              type: "SET_FEATURED_ARTICLE",
              payload: data.articles[0],
            });
          }
        } else {
          dispatch({
            type: "APPEND_ARTICLES",
            payload: {
              articles: data.articles,
              hasMore: data.hasMore,
            },
          });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "An error occurred",
        });
      }
    },
    [state.currentOffset, state.searchTerm]
  );

  const loadMoreArticles = useCallback(async () => {
    if (!state.hasMore || state.loading) return;
    await loadArticles(false);
  }, [state.hasMore, state.loading, loadArticles]);

  const searchArticles = useCallback(
    async (searchTerm: string) => {
      dispatch({ type: "SET_SEARCH_TERM", payload: searchTerm });
      await loadArticles(true);
    },
    [loadArticles]
  );

  const setSelectedCategory = useCallback((category: string) => {
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  }, []);

  const getFilteredArticles = useCallback(() => {
    let filtered = state.articles;

    // Exclude featured article from the list to avoid duplication
    if (state.featuredArticle) {
      filtered = filtered.filter(
        article => article.id !== state.featuredArticle!.id
      );
    }

    // Apply category filter (client-side filtering)
    if (state.selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        article => article.category === state.selectedCategory
      );
    }

    return filtered;
  }, [state.articles, state.selectedCategory, state.featuredArticle]);

  const contextValue: ArticleContextType = {
    state,
    loadArticles,
    loadMoreArticles,
    searchArticles,
    setSelectedCategory,
    getFilteredArticles,
  };

  return (
    <ArticleContext.Provider value={contextValue}>
      {children}
    </ArticleContext.Provider>
  );
}
