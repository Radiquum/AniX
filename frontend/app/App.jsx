"use client";

import { NavigationRail } from "@/app/components/NavigationRail/NavigationRail";
import { useThemeStore } from "./store/theme-store";
import { useEffect } from "react";
// import { useStore } from "./store/app-store";

export const App = (props) => {
  const themeStore = useThemeStore();

  useEffect(() => {
    themeStore.checkTheme();
  }, []);

  return (
    <body className={themeStore.theme}>
      <NavigationRail />
      <main className="responsive">{props.children}</main>
    </body>
  );
};
