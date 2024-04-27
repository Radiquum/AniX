"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

function saveSettings(dict) {
  localStorage.setItem("settings", JSON.stringify(dict));
}

function loadSettings() {
  return JSON.parse(localStorage.getItem("settings"));
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      saveToHistory: true,
      setSettings: (dict) => {
        set(dict);
      },
    }),
    {
      name: "settings",
    },
  ),
);
