"use client";

import React, { createContext, useCallback, useContext } from "react";
import type { TutorialDisplayData } from "../components/tutorials/TutorialDisplayCard";

interface TutorialState {
  tutorials: TutorialDisplayData[];
  featuredTutorial: TutorialDisplayData | null;
  total: number;
  hasMore: boolean;
  loading: boolean;
  fetchCompleted: boolean;
  error: string | null;
  searchTerm: string;
  currentOffset: number;
}

const initialState: TutorialState = {
  tutorials: [],
  featuredTutorial: null,
  total: 0,
  hasMore: false,
  loading: true,
  fetchCompleted: false,
  error: null,
  searchTerm: "",
  currentOffset: 0,
};

interface TutorialContextValue {
  state: TutorialState;
  loadTutorials: (_reset?: boolean, _searchTerm?: string) => Promise<void>;
  loadMoreTutorials: () => Promise<void>;
  searchTutorials: (_searchTerm: string) => Promise<void>;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

export function useTutorials() {
  const context = useContext(TutorialContext);
  if (!context)
    throw new Error("useTutorials must be used within TutorialProvider");
  return context;
}

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState(initialState);

  const loadTutorials = useCallback(
    async (_reset = false, _searchTerm?: string) => {
      const offset = _reset ? 0 : state.currentOffset;
      setState(current => ({
        ...current,
        loading: true,
        fetchCompleted: false,
        error: null,
      }));

      try {
        const params = new URLSearchParams({
          limit: "20",
          offset: String(offset),
        });
        if (_searchTerm !== undefined ? _searchTerm : state.searchTerm) {
          params.set("search", _searchTerm ?? state.searchTerm);
        }
        const response = await fetch(`/api/tutorials?${params}`);
        if (!response.ok) throw new Error("Failed to fetch tutorials");
        const data = await response.json();
        const tutorials: TutorialDisplayData[] = Array.isArray(data.tutorials)
          ? data.tutorials
          : [];

        setState(current => ({
          ...current,
          tutorials:
            _reset || offset === 0
              ? tutorials
              : [...current.tutorials, ...tutorials],
          featuredTutorial:
            _reset || offset === 0
              ? (tutorials[0] ?? null)
              : current.featuredTutorial,
          total: data.total ?? tutorials.length,
          hasMore: Boolean(data.hasMore),
          loading: false,
          fetchCompleted: true,
          currentOffset:
            _reset || offset === 0
              ? tutorials.length
              : current.currentOffset + tutorials.length,
        }));
      } catch (error) {
        setState(current => ({
          ...current,
          loading: false,
          fetchCompleted: true,
          error:
            error instanceof Error ? error.message : "Unable to load tutorials",
        }));
      }
    },
    [state.currentOffset, state.searchTerm]
  );

  const loadMoreTutorials = useCallback(async () => {
    if (state.hasMore && !state.loading) await loadTutorials(false);
  }, [state.hasMore, state.loading, loadTutorials]);

  const searchTutorials = useCallback(
    async (_searchTerm: string) => {
      setState(current => ({
        ...current,
        searchTerm: _searchTerm,
        currentOffset: 0,
        featuredTutorial: null,
      }));
      await loadTutorials(true, _searchTerm);
    },
    [loadTutorials]
  );

  return (
    <TutorialContext.Provider
      value={{ state, loadTutorials, loadMoreTutorials, searchTutorials }}
    >
      {children}
    </TutorialContext.Provider>
  );
}
