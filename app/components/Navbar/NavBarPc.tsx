"use client";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownItem,
} from "flowbite-react";
import { useUserStore } from "#/store/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NavbarItems = [
  {
    title: "Домашняя",
    icon: "mdi--home",
    href: "/",
    auth: false,
  },
  {
    title: "Обзор",
    icon: "mdi--compass",
    href: "/discovery",
    auth: false,
  },
  {
    title: "Поиск",
    icon: "mdi--search",
    href: "/search",
    auth: false,
  },
  {
    title: "Закладки",
    icon: "mdi--bookmark-multiple",
    href: "/bookmarks",
    auth: true,
  },
  {
    title: "Избранное",
    icon: "mdi--favorite",
    href: "/favorites",
    auth: true,
  },
  {
    title: "Коллекции",
    icon: "mdi--collections-bookmark",
    href: "/collections",
    auth: true,
  },
  {
    title: "История",
    icon: "mdi--history",
    href: "/history",
    auth: true,
  },
];

export const NavBarPc = (props: { setIsSettingModalOpen: any }) => {
  const userStore = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 hidden w-full h-16 font-medium text-white bg-black rounded-b-lg lg:block">
        <div className="container flex items-center justify-between h-full px-2 mx-auto">
          <div className="flex items-center h-full gap-3">
            {NavbarItems.map((item) => {
              if (item.auth && !userStore.isAuth) return <></>;
              return (
                <Link
                  href={item.href}
                  key={`navbar-pc-${item.title}`}
                  className="flex items-center"
                >
                  <span className={`iconify ${item.icon} w-6 h-6`}></span>
                  <span className="ml-1">{item.title}</span>
                </Link>
              );
            })}
          </div>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center">
                <Avatar
                  alt=""
                  img={
                    userStore.isAuth ?
                      userStore.user.avatar
                    : "https://s.anixmirai.com/avatars/no_avatar.jpg"
                  }
                  rounded
                  size="xs"
                />
                <p className="ml-2">
                  {userStore.isAuth ? userStore.user.login : "Аноним"}
                </p>
              </div>
            }
          >
            {userStore.isAuth ?
              <DropdownItem
                onClick={() => router.push(`/profile/${userStore.user.id}`)}
                className="relative flex"
              >
                <span className="w-4 h-4 iconify mdi--user"></span>
                <span className="ml-2">Профиль</span>
              </DropdownItem>
            : ""}
            <DropdownItem
              onClick={() => props.setIsSettingModalOpen(true)}
              className="relative flex"
            >
              <span className="w-4 h-4 iconify mdi--settings"></span>
              <span className="ml-2">Настройки</span>
            </DropdownItem>
            {userStore.isAuth ?
              <DropdownItem
                onClick={() => userStore.logout()}
                className="relative flex"
              >
                <span className="w-4 h-4 iconify mdi--logout"></span>
                <span className="ml-2">Выйти</span>
              </DropdownItem>
            : <DropdownItem
                onClick={() => router.push(`/login?redirect=${pathname}`)}
                className="relative flex"
              >
                <span className="w-4 h-4 iconify mdi--login"></span>
                <span className="ml-2">Войти</span>
              </DropdownItem>
            }
          </Dropdown>
        </div>
      </header>
    </>
  );
};
