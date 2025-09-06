// Epoch Semantic Versioning - https://antfu.me/posts/epoch-semver
// {EPOCH * 1000 + MAJOR}.MINOR.PATCH
export const appVersion = "1001.0.0";

export const BASE_URLS = [
  "https://api-s.anixsekai.com/",
  "https://api.anixsekai.com/",
];

export type ANIXART_HEADERST = {
  "User-Agent": string;
  "Content-Type": string;
  "Api-Version"?: string;
};
export const ANIXART_UA = "AnixartApp/9.0 BETA 5-25062213 (Android 9; SDK 28; arm64-v8a; samsung SM-G975N; en)";
export const ANIXART_HEADERS: ANIXART_HEADERST = {
  "User-Agent": ANIXART_UA,
  "Content-Type": "application/json; charset=UTF-8",
};