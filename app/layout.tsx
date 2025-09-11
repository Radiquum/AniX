import "./globals.css";
import { App } from "./App";
import { ThemeModeScript } from "flowbite-react";
import { ThemeInit } from "../.flowbite-react/init";

export const metadata = {
  metadataBase: new URL(process.env.METADATA_BASE_URL || "https://example.com"),
  keywords: [],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    template: "AniX | %s",
    default: "AniX | Домашняя",
  },
  description: "Неофициальное приложение для anixart-app.com",

  openGraph: {
    url: process.env.METADATA_BASE_URL || "https://example.com",
    images: [
      {
        url: "/opengraph.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInit />
        <ThemeModeScript />
      </head>
      <App>{children}</App>
    </html>
  );
}
