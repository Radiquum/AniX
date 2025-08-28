import "./globals.css";
import { App } from "./App";
import { ThemeModeScript } from "flowbite-react";
import { PublicEnvScript } from 'next-runtime-env';
import { ThemeInit } from "../.flowbite-react/init";

export const metadata = {
  metadataBase: new URL("https://anix.wah.su"),
  keywords: ["anix", "anixart", "anime", "аниксарт", "аниме"],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    template: "AniX | %s",
    default: "AniX | Домашняя",
  },
  description: "Неофициальное приложение для anixart.tv",

  openGraph: {
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
        <PublicEnvScript />
        <ThemeInit />
        <ThemeModeScript />
      </head>
      <App>{children}</App>
    </html>
  );
}
