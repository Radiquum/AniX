"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deepmerge } from "deepmerge-ts";

interface preferencesState {
  _hasHydrated: boolean;
  flags: {
    // saveSearchHistory: boolean;
    saveWatchHistory?: boolean;
    showChangelog?: boolean;
    showFifthButton?: null | string;
  };
  params: {
    isFirstLaunch?: boolean;
    version?: string;
    skipToCategory?: {
      enabled: boolean;
      homeCategory: string;
      bookmarksCategory: string;
    };
    experimental?: {
      newPlayer: boolean;
    };
    // color: {
    //   primary: string;
    //   secondary: string;
    //   accent: string;
    // }
  };
  setHasHydrated: (state: boolean) => void;
  setFlags: (flags: preferencesState["flags"]) => void;
  setParams: (params: preferencesState["params"]) => void;
}

export const usePreferencesStore = create<preferencesState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      flags: {
        saveWatchHistory: true,
        showChangelog: true,
        showFifthButton: "discovery",
      },
      params: {
        isFirstLaunch: true,
        version: "3.0.0",
        skipToCategory: {
          enabled: false,
          homeCategory: "last",
          bookmarksCategory: "watching",
        },
        experimental: {
          newPlayer: false,
        },
      },
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
      setFlags(flags) {
        set({ flags: { ...get().flags, ...flags } });
      },
      setParams(params) {
        set({ params: { ...get().params, ...params } });
      },
    }),
    {
      name: "preferences",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
      merge: (persistedState, currentState) => {
        return deepmerge(
          currentState as preferencesState,
          persistedState as preferencesState
        );
      },
      version: 2,
    },
  )
);
