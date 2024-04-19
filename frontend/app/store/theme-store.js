"use client";
import { create } from "zustand";

export function setTheme(theme) {
  localStorage.setItem("theme", theme);
}
export function getTheme() {
  return localStorage.getItem("theme");
}

export const useThemeStore = create((set) => ({
  theme: "light",
  changeTheme: (theme) => {
    set({ theme: theme });
    setTheme(theme);
  },
  checkTheme: () => {
    set({ theme: getTheme() || "light" });
  }
}));
