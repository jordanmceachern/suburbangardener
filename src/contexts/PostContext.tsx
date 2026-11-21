"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  ALL_POST_CATEGORIES,
  DEFAULT_POST_CATEGORY,
  normalizeCategoryValue,
} from "@/lib/postSecurity";
import type { PostDisplayData } from "../components/posts/PostDisplayCard";

interface PostState {
  posts: PostDisplayData[];
  featuredPost: PostDisplayData | null;
  total: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  currentOffset: number;
}

type PostAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_POSTS";
      payload: {
        posts: PostDisplayData[];
        total: number;
        hasMore: boolean;
      };
    }
  | {
      type: "APPEND_POSTS";
      payload: { posts: PostDisplayData[]; hasMore: boolean };
    }
  | { type: "SET_FEATURED_POST"; payload: PostDisplayData | null }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_OFFSET"; payload: number }
  | { type: "RESET_PAGINATION" };

const initialState: PostState = {
  posts: [],
  featuredPost: null,
  total: 0,
  hasMore: false,
  loading: true,
  error: null,
  searchTerm: "",
  selectedCategory: ALL_POST_CATEGORIES,
  currentOffset: 0,
};

// Renders the PostReducer Post UI.
function PostReducer(state: PostState, action: PostAction): PostState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload.posts,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null,
        currentOffset: action.payload.posts.length,
      };
    case "APPEND_POSTS":
      return {
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        hasMore: action.payload.hasMore,
        loading: false,
        currentOffset: state.currentOffset + action.payload.posts.length,
      };
    case "SET_FEATURED_POST":
      return {
        ...state,
        featuredPost: action.payload,
      };
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

interface PostContextType {
  state: PostState;
  loadPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  searchPosts: (_searchTerm: string) => Promise<void>;
  setSelectedCategory: (_category: string) => void;
  getFilteredPosts: () => PostDisplayData[];
}

const PostContext = createContext<PostContextType | null>(null);

// Exposes the Post context so components can read and update Post state.
export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within an PostProvider");
  }
  return context;
}

interface PostProviderProps {
  children: React.ReactNode;
}

// Provides Post Provider context to the component tree.
export function PostProvider({ children }: PostProviderProps) {
  const [state, dispatch] = useReducer(PostReducer, initialState);

  const loadPosts = useCallback(
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

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Posts");
        }

        const data = await response.json();

        if (reset || offset === 0) {
          dispatch({
            type: "SET_POSTS",
            payload: {
              posts: data.posts,
              total: data.total,
              hasMore: data.hasMore,
            },
          });

          // Set featured Post (first Post)
          if (data.posts.length > 0) {
            dispatch({
              type: "SET_FEATURED_POST",
              payload: data.posts[0],
            });
          }
        } else {
          dispatch({
            type: "APPEND_POSTS",
            payload: {
              posts: data.posts,
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

  const loadMorePosts = useCallback(async () => {
    if (!state.hasMore || state.loading) return;
    await loadPosts(false);
  }, [state.hasMore, state.loading, loadPosts]);

  const searchPosts = useCallback(
    async (searchTerm: string) => {
      dispatch({ type: "SET_SEARCH_TERM", payload: searchTerm });
      await loadPosts(true);
    },
    [loadPosts]
  );

  const setSelectedCategory = useCallback((category: string) => {
    dispatch({
      type: "SET_SELECTED_CATEGORY",
      payload: normalizeCategoryValue(category),
    });
  }, []);

  const getFilteredPosts = useCallback(() => {
    let filtered = state.posts;

    // Exclude featured Post from the list to avoid duplication
    if (state.featuredPost) {
      filtered = filtered.filter(post => post.id !== state.featuredPost!.id);
    }

    // Apply category filter (client-side filtering)
    if (state.selectedCategory !== ALL_POST_CATEGORIES) {
      filtered = filtered.filter(
        post =>
          normalizeCategoryValue(post.category || DEFAULT_POST_CATEGORY) ===
          normalizeCategoryValue(state.selectedCategory)
      );
    }

    return filtered;
  }, [state.posts, state.selectedCategory, state.featuredPost]);

  const contextValue: PostContextType = {
    state,
    loadPosts,
    loadMorePosts,
    searchPosts,
    setSelectedCategory,
    getFilteredPosts,
  };

  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
}
