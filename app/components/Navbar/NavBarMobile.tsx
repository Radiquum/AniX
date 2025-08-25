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
import { usePreferencesStore } from "#/store/preferences";

const NavbarItems = [
  {
    title: "Домашняя",
    icon: "mdi--home",
    href: "/",
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
];

const FifthButton = {
  favorites: {
    title: "Избранное",
    icon: "mdi--favorite",
    href: "/favorites",
    auth: true,
  },
  collections: {
    title: "Коллекции",
    icon: "mdi--collections-bookmark",
    href: "/collections",
    auth: true,
  },
  history: {
    title: "История",
    icon: "mdi--history",
    href: "/history",
    auth: true,
  },
  discovery: {
    title: "Обзор",
    icon: "mdi--compass",
    href: "/discovery",
    auth: true,
  },
};

export const NavBarMobile = (props: { setIsSettingModalOpen: any }) => {
  const userStore = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const preferenceStore = usePreferencesStore();

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-50 block w-full h-[70px] font-medium text-white bg-black rounded-t-lg lg:hidden">
        <div className="flex items-center justify-center h-full gap-4">
          {NavbarItems.map((item) => {
            if (item.auth && !userStore.isAuth) return <></>;
            return (
              <Link
                href={item.href}
                key={`navbar-mobile-${item.title}`}
                className="flex flex-col items-center justify-center gap-1"
              >
                <span className={`iconify ${item.icon} w-6 h-6`}></span>
                <span className="text-sm">{item.title}</span>
              </Link>
            );
          })}
          {userStore.isAuth && preferenceStore.flags.showFifthButton ?
            <Link
              href={FifthButton[preferenceStore.flags.showFifthButton].href}
              key={`navbar-mobile-${FifthButton[preferenceStore.flags.showFifthButton].title}`}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={`iconify ${FifthButton[preferenceStore.flags.showFifthButton].icon} w-6 h-6`}
              ></span>
              <span className="text-sm">
                {FifthButton[preferenceStore.flags.showFifthButton].title}
              </span>
            </Link>
          : ""}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex flex-col items-center justify-center gap-1">
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
                <p className="text-sm">
                  {userStore.isAuth ? userStore.user.login : "Аноним"}
                </p>
              </div>
            }
          >
            {userStore.isAuth && (
              <>
                <DropdownItem
                  onClick={() => router.push(`/profile/${userStore.user.id}`)}
                >
                  <span className="w-4 h-4 iconify mdi--user"></span>
                  <span className="ml-2">Профиль</span>
                </DropdownItem>
                {Object.entries(FifthButton).map(([key, item]) => {
                  if (item.auth && !userStore.isAuth) return <></>;
                  if (preferenceStore.flags.showFifthButton === key)
                    return <></>;
                  return (
                    <DropdownItem
                      key={`navbar-mobile-${item.title}`}
                      onClick={() => router.push(item.href)}
                    >
                      <span className={`w-4 h-4 iconify ${item.icon}`}></span>
                      <span className="ml-2">{item.title}</span>
                    </DropdownItem>
                  );
                })}
                <DropdownDivider />
              </>
            )}
            <DropdownItem
              onClick={() => props.setIsSettingModalOpen(true)}
              className="relative flex"
            >
              <span className="w-4 h-4 iconify mdi--settings"></span>
              <span className="ml-2">Настройки</span>
            </DropdownItem>
            {userStore.isAuth ?
              <DropdownItem onClick={() => userStore.logout()}>
                <span className="w-4 h-4 iconify mdi--logout"></span>
                <span className="ml-2">Выйти</span>
              </DropdownItem>
            : <DropdownItem
                onClick={() => router.push(`/login?redirect=${pathname}`)}
              >
                <span className="w-4 h-4 iconify mdi--login"></span>
                <span className="ml-2">Войти</span>
              </DropdownItem>
            }
          </Dropdown>
        </div>
      </footer>
    </>
  );
};
