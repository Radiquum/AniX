"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/app/store/user-store";
import { useRouter } from "next/navigation";

export const NavigationRail = (props) => {
  const pathname = usePathname();
  const userStore = useUserStore();
  const router = useRouter();

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
      {userStore.isAuth && userStore.user ? (
        <Link className="circle transparent " href="/profile">
          <Image
            className="responsive"
            src={userStore.user.profile.avatar}
            alt="Ваш профиль"
            width="64"
            height="64"
          />
        </Link>
      ) : (
        <button
          className="circle transparent"
          onClick={() => {
            router.push("/login");
          }}
        >
          <i className="responsive">login</i>
        </button>
      )}

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

      {userStore.isAuth ? (
        <button
          className="circle transparent"
          onClick={() => userStore.logout()}
        >
          <i>logout</i>
        </button>
      ) : (
        ""
      )}
    </nav>
  );
};
