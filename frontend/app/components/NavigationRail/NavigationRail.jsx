"use client";

import { usePathname } from "next/navigation";
import { useThemeStore } from "@/app/store/theme-store";
import Link from "next/link";

export const NavigationRail = () => {
  const pathname = usePathname();
  const themeStore = useThemeStore();

  return (
    <nav className="left">
      <button className="circle transparent ">
        <img className="responsive" src="/favicon.ico"></img>
      </button>

      <Link href="/" className={pathname == "/" ? "active" : ""}>
        <i>home</i>
        <div>Домашняя</div>
      </Link>
      <Link href="/search" className={pathname == "/search" ? "active" : ""}>
        <i>search</i>
        <div>Поиск</div>
      </Link>
      <Link
        href="/bookmarks"
        className={pathname == "/bookmarks" ? "active" : ""}
      >
        <i>bookmark</i>
        <div>Закладки</div>
      </Link>
      <Link
        href="/favorites"
        className={pathname == "/favorites" ? "active" : ""}
      >
        <i>favorite</i>
        <div>Избранное</div>
      </Link>
      <Link href="/history" className={pathname == "/history" ? "active" : ""}>
        <i>history</i>
        <div>История</div>
      </Link>
      {/* <a>
        <i>share</i>
        <div>share</div>
      </a> */}
      <span className="max"></span>
      <button className="circle transparent" onClick={() => themeStore.changeTheme(themeStore.theme == "dark" ? "light" : "dark")}>
        <i>palette</i>
      </button>
    </nav>
  );
};
