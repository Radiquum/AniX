"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavigationRail = (props) => {
  const pathname = usePathname();

  const items = [
    {
      title: "Домашняя",
      icon: "home",
      path: "/",
    },
    {
      title: "Поиск",
      icon: "search",
      path: "/search",
    },
    {
      title: "Закладки",
      icon: "bookmark",
      path: "/bookmarks",
    },
    {
      title: "Избранное",
      icon: "favorite",
      path: "/favorites",
    },
    {
      title: "История",
      icon: "history",
      path: "/history",
    },
  ];

  return (
    <nav className="left">
      <button className="circle transparent ">
        <img className="responsive" src="/favicon.ico"></img>
      </button>

      {items.map((item) => {
        return (
          <Link
            key={item.path}
            href={item.path}
            className={pathname == item.path ? "active" : ""}
          >
            <i>{item.icon}</i>
            <div>{item.title}</div>
          </Link>
        );
      })}

      <span className="max"></span>
      <button
        className="circle transparent"
        onClick={() => props.setColorPicker(!props.colorPicker)}
      >
        <i>palette</i>
      </button>
    </nav>
  );
};
