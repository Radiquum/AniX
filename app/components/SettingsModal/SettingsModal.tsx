"use client";

import { CURRENT_APP_VERSION } from "#/api/config";
import { useUserStore } from "#/store/auth";
import { usePreferencesStore } from "#/store/preferences";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  HR,
  Modal,
  ModalBody,
  ModalHeader,
  ToggleSwitch,
  useThemeMode,
} from "flowbite-react";
import Link from "next/link";
import { env } from "next-runtime-env";
import { useEffect, useState } from "react";

const HomeCategory = {
  last: "Последние релизы",
  finished: "Завершенные релизы",
  ongoing: "Выходит",
  announce: "Анонсированные релизы",
  films: "Фильмы",
};

const BookmarksCategory = {
  watching: "Смотрю",
  planned: "В планах",
  watched: "Просмотрено",
  delayed: "Отложено",
  abandoned: "Заброшено",
};

const NavbarTitles = {
  always: "Всегда",
  links: "Только ссылки",
  selected: "Только выбранные",
  never: "Никогда",
};

const FifthButton = {
  3: "Избранное",
  4: "Коллекции",
  5: "История",
};

export const SettingsModal = (props: { isOpen: boolean; setIsOpen: any }) => {
  const preferenceStore = usePreferencesStore();
  const userStore = useUserStore();

  const { computedMode, setMode } = useThemeMode();
  const [isPlayerConfigured, setIsPlayerConfigured] = useState(false);

  useEffect(() => {
    const NEXT_PUBLIC_PLAYER_PARSER_URL = env("NEXT_PUBLIC_PLAYER_PARSER_URL") || null;
    if (NEXT_PUBLIC_PLAYER_PARSER_URL) {
      setIsPlayerConfigured(true);
    }
  }, []);

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <ModalHeader>Настройки</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 iconify material-symbols--palette-outline"></span>
            <p className="text-lg font-bold dark:text-white">Интерфейс</p>
          </div>
          <div className="flex items-center justify-between">
            <p className=" dark:text-white">Тема</p>
            <ButtonGroup>
              <Button
                color={computedMode == "light" ? "blue" : "light"}
                onClick={() => setMode("light")}
              >
                Светлая
              </Button>
              <Button
                color={computedMode == "dark" ? "blue" : "light"}
                onClick={() => setMode("dark")}
              >
                Темная
              </Button>
            </ButtonGroup>
          </div>
          <div className="flex items-center justify-between">
            <p className=" dark:text-white max-w-96">
              Пропускать страницу выбора категорий на страницах Домашняя и
              Закладки
            </p>
            <ToggleSwitch
              color="blue"
              onChange={() =>
                preferenceStore.setParams({
                  skipToCategory: {
                    ...preferenceStore.params.skipToCategory,
                    enabled: !preferenceStore.params.skipToCategory.enabled,
                  },
                })
              }
              checked={preferenceStore.params.skipToCategory.enabled}
            />
          </div>
          {preferenceStore.params.skipToCategory.enabled ?
            <>
              <div className="flex items-center justify-between">
                <p className=" dark:text-white max-w-96">
                  Категория домашней страницы
                </p>
                <Dropdown
                  color="blue"
                  label={
                    HomeCategory[
                      preferenceStore.params.skipToCategory.homeCategory
                    ]
                  }
                >
                  {Object.keys(HomeCategory).map((key) => {
                    return (
                      <DropdownItem
                        key={key}
                        onClick={() =>
                          preferenceStore.setParams({
                            skipToCategory: {
                              ...preferenceStore.params.skipToCategory,
                              homeCategory: key,
                            },
                          })
                        }
                      >
                        {HomeCategory[key]}
                      </DropdownItem>
                    );
                  })}
                </Dropdown>
              </div>
              <div className="flex items-center justify-between">
                <p className=" dark:text-white max-w-96">
                  Категория страницы закладок
                </p>
                <Dropdown
                  color="blue"
                  label={
                    BookmarksCategory[
                      preferenceStore.params.skipToCategory.bookmarksCategory
                    ]
                  }
                >
                  {Object.keys(BookmarksCategory).map((key) => {
                    return (
                      <DropdownItem
                        key={key}
                        onClick={() =>
                          preferenceStore.setParams({
                            skipToCategory: {
                              ...preferenceStore.params.skipToCategory,
                              bookmarksCategory: key,
                            },
                          })
                        }
                      >
                        {BookmarksCategory[key]}
                      </DropdownItem>
                    );
                  })}
                </Dropdown>
              </div>
            </>
          : ""}
          <div className="flex items-center justify-between">
            <p className=" dark:text-white max-w-96">
              Показывать название пункта в навигации
            </p>
            <Dropdown
              color="blue"
              label={NavbarTitles[preferenceStore.flags.showNavbarTitles]}
            >
              {Object.keys(NavbarTitles).map(
                (key: "always" | "links" | "selected" | "never") => {
                  return (
                    <DropdownItem
                      className={`${key == "links" ? "hidden lg:flex" : ""}`}
                      key={`navbar-titles-${key}`}
                      onClick={() =>
                        preferenceStore.setFlags({
                          showNavbarTitles: key,
                        })
                      }
                    >
                      {NavbarTitles[key]}
                    </DropdownItem>
                  );
                }
              )}
            </Dropdown>
          </div>
          {userStore.isAuth ?
            <div className="flex items-center justify-between sm:hidden">
              <p className=" dark:text-white max-w-96">
                Пятый пункт в навигации
              </p>
              <Dropdown
                color="blue"
                label={
                  preferenceStore.flags.showFifthButton ?
                    FifthButton[preferenceStore.flags.showFifthButton]
                  : "Нет"
                }
              >
                <DropdownItem
                  onClick={() =>
                    preferenceStore.setFlags({
                      showFifthButton: null,
                    })
                  }
                >
                  Не показывать
                </DropdownItem>
                {Object.keys(FifthButton).map((key) => {
                  return (
                    <DropdownItem
                      key={`navbar-fifthbutton-${key}`}
                      onClick={() =>
                        preferenceStore.setFlags({
                          showFifthButton: Number(key) as 3 | 4 | 5,
                        })
                      }
                    >
                      {FifthButton[key]}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
          : ""}
          <HR className="my-4 dark:bg-slate-400" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 iconify material-symbols--settings-outline"></span>
            <p className="text-lg font-bold dark:text-white">Приложение</p>
          </div>
          <div className="flex items-center justify-between">
            <p className=" dark:text-white">Показывать список изменений</p>
            <ToggleSwitch
              color="blue"
              onChange={() =>
                preferenceStore.setFlags({
                  showChangelog: !preferenceStore.flags.showChangelog,
                })
              }
              checked={preferenceStore.flags.showChangelog}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className=" dark:text-white">Сохранять историю просмотра</p>
              <p className="max-w-sm text-gray-500 dark:text-gray-300">
                При отключении, история не будет сохранятся как локально, так и
                на аккаунте
              </p>
            </div>
            <ToggleSwitch
              color="blue"
              onChange={() =>
                preferenceStore.setFlags({
                  saveWatchHistory: !preferenceStore.flags.saveWatchHistory,
                })
              }
              checked={preferenceStore.flags.saveWatchHistory}
            />
          </div>
          <HR className="my-4 dark:bg-slate-400" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 iconify material-symbols--experiment-outline"></span>
            <p className="text-lg font-bold dark:text-white">Эксперименты</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className=" dark:text-white">Новый плеер</p>
              <p className="text-gray-500 dark:text-gray-300">
                Поддерживаемые источники: Kodik, Sibnet, Libria
              </p>
            </div>
            <ToggleSwitch
              color="blue"
              onChange={() =>
                preferenceStore.setParams({
                  experimental: {
                    ...preferenceStore.params.experimental,
                    newPlayer: !preferenceStore.params.experimental.newPlayer,
                  },
                })
              }
              checked={preferenceStore.params.experimental.newPlayer}
              disabled={!isPlayerConfigured}
            />
          </div>
        </div>
        <HR className="my-4 dark:bg-slate-400" />
        <div>
          <Link
            href={"/about"}
            className="flex items-center gap-2 p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
            onClick={() => props.setIsOpen(false)}
          >
            <span className="w-8 h-8 iconify material-symbols--info"></span>
            <div>
              <p>О приложении</p>
              <p className="text-sm text-gray-400 dark:text-gray-200">
                v{CURRENT_APP_VERSION}
              </p>
            </div>
          </Link>
        </div>
      </ModalBody>
    </Modal>
  );
};
