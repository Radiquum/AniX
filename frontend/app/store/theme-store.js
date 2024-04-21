"use client";
export function setMode(mode) {
  localStorage.setItem("mode", mode);
}
export function getMode() {
  return localStorage.getItem("mode");
}

export function setTheme(theme) {
  localStorage.setItem("theme", theme);
}
export function getTheme() {
  return localStorage.getItem("theme");
}

