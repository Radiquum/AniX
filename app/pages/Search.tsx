"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Dropdown, DropdownItem } from "flowbite-react";
import { useUserStore } from "#/store/auth";
import { ENDPOINTS } from "#/api/config";
import { tryCatchAPI } from "#/api/utils";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "#/components/Spinner/Spinner";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { UserSection } from "#/components/UserSection/UserSection";
import { CollectionsSection } from "#/components/CollectionsSection/CollectionsSection";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { RelatedSection } from "#/components/RelatedSection/RelatedSection";

const postFetcher = async (url: string, payload: string) => {
  const { data, error } = await tryCatchAPI(
    fetch(url, {
      method: "POST",
      headers: {
        "Api-Version": "v2",
        "Content-Type": "application/json",
      },
      body: payload,
    })
  );

  if (error) {
    throw error;
  }
  return data;
};

const whereMapping = [
  {
    id: "releases",
    label: "Релизах",
    auth: false,
  },
  {
    id: "profiles",
    label: "Профилях",
    auth: false,
  },
  {
    id: "list",
    label: "Списках",
    auth: true,
  },
  {
    id: "history",
    label: "Истории",
    auth: true,
  },
  {
    id: "favorites",
    label: "Избранном",
    auth: true,
  },
  {
    id: "collections_all",
    label: "Всех Коллекциях",
    auth: false,
  },
  {
    id: "collections_fav",
    label: "Своих Коллекциях",
    auth: true,
  },
];

const searchByMapping = {
  releases: [
    {
      id: "name",
      label: "Названию",
      value: 0,
    },
    {
      id: "studio",
      label: "Студии",
      value: 1,
    },
    {
      id: "director",
      label: "Режиссёру",
      value: 2,
    },
    {
      id: "author",
      label: "Автору",
      value: 3,
    },
    {
      id: "tag",
      label: "Тегу",
      value: 4,
    },
  ],
  list: [
    {
      id: "watching",
      label: "Смотрю",
      value: 1,
    },
    {
      id: "planned",
      label: "В планах",
      value: 2,
    },
    {
      id: "watched",
      label: "Просмотрено",
      value: 3,
    },
    {
      id: "delayed",
      label: "Отложено",
      value: 4,
    },
    {
      id: "abandoned",
      label: "Заброшено",
      value: 5,
    },
  ],
  none: [{ id: "none", label: "Нет", value: 0 }],
};

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userStore = useUserStore();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [params, setParams] = useState(null);
  const [content, setContent] = useState(null);

  const [HeaderH, setHeaderH] = useState(null);

  useEffect(() => {
    const queryParams = searchParams.get("params");

    if (queryParams) {
      try {
        setParams(JSON.parse(queryParams));
      } catch (e) {
        setParams({
          where: "releases",
          searchBy: "name",
        });
      }
    } else {
      setParams({
        where: "releases",
        searchBy: "name",
      });
    }

    if (window) {
      setHeaderH(document.querySelector("header").clientHeight);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!params) return;

    const url = new URL(`/search`, window.location.origin);
    url.searchParams.set("query", query);
    url.searchParams.set("params", JSON.stringify(params));
    router.replace(url.toString());
    setContent(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    setContent(null);

    const url = new URL(`/search`, window.location.origin);
    url.searchParams.set("query", query);
    url.searchParams.set("params", JSON.stringify(params));
    router.replace(url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!params) return null;
    if (!query) return null;

    if (previousPageData) {
      if (params.where == "releases") {
        if (!previousPageData.releases.length) return null;
      } else {
        if (!previousPageData.content.length) return null;
      }
    }

    let url = null;
    switch (params.where) {
      case "releases":
        url = `${ENDPOINTS.search.releases}/${pageIndex}`;
        break;
      case "profiles":
        url = `${ENDPOINTS.search.profiles}/${pageIndex}`;
        break;
      case "list":
        const list = searchByMapping[params.where].find(
          (item) => item.id == params.searchBy
        );
        if (!list) break;
        url = `${ENDPOINTS.search.profileList}/${list.value}/${pageIndex}`;
        break;
      case "history":
        url = `${ENDPOINTS.search.profileHistory}/${pageIndex}`;
        break;
      case "favorites":
        url = `${ENDPOINTS.search.profileFavorites}/${pageIndex}`;
        break;
      case "collections_all":
        url = `${ENDPOINTS.search.collections}/${pageIndex}`;
        break;
      case "collections_fav":
        url = `${ENDPOINTS.search.profileFavoriteCollection}/${pageIndex}`;
        break;
    }

    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }

    let searchBy = null;
    const _sbym = searchByMapping[params.where];
    if (_sbym) {
      searchBy = _sbym.find((item) => item.id == params.searchBy).value;
    } else {
      searchBy = searchByMapping["none"][0].value;
    }

    return [url, JSON.stringify({ query, searchBy })];
  };

  const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite(
    getKey,
    ([url, payload]) => postFetcher(url, payload),
    { initialSize: 2 }
  );

  useEffect(() => {
    if (data) {
      let _content = [];
      if (params.where == "releases") {
        for (let i = 0; i < data.length; i++) {
          _content.push(...data[i].releases);
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          _content.push(...data[i].content);
        }
      }
      setContent(_content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  if (!params) return <></>;

  return (
    <div>
      <div
        className="sticky top-0 sm:top-[var(--header-height)] z-30 flex flex-wrap w-full gap-2 bg-black bg-opacity-25 py-2 px-2 rounded-lg backdrop-blur-sm"
        style={{ "--header-height": `${HeaderH}px` } as React.CSSProperties}
      >
        <div className="flex flex-col flex-1 w-full lg:flex-row">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Поиск аниме..."
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-2 lg:ml-2 lg:mt-0">
            <div className="flex justify-between flex-1 gap-4">
              <Dropdown
                size="xl"
                label={`Искать в: ${whereMapping.find((item) => item.id == params.where).label}`}
                color="light"
                className="w-full lg:w-fit"
              >
                {whereMapping.map((item) => {
                  return item.auth && !userStore.isAuth ?
                      <></>
                    : <DropdownItem
                        onClick={() =>
                          searchByMapping[item.id] ?
                            setParams({
                              where: item.id,
                              searchBy: searchByMapping[item.id][0].id,
                            })
                          : setParams({ where: item.id, searchBy: "none" })
                        }
                        key={`filter--where--${item.id}`}
                      >
                        {item.label}
                      </DropdownItem>;
                })}
              </Dropdown>
            </div>
            {searchByMapping[params.where] ?
              <div className="flex justify-between flex-1 gap-4">
                <Dropdown
                  size="xl"
                  label={`Искать по: ${
                    params.searchBy == "none" ?
                      searchByMapping.none[0].label
                    : searchByMapping[params.where].find(
                        (item) => item.id == params.searchBy
                      ).label
                  }`}
                  color="light"
                  className="w-full lg:w-fit"
                >
                  {searchByMapping[params.where].map((item) => {
                    return (
                      <DropdownItem
                        onClick={() =>
                          setParams({
                            where: params.where,
                            searchBy: item.id,
                          })
                        }
                        key={`filter--where--${params.where}--searchBy--${item.id}`}
                      >
                        {item.label}
                      </DropdownItem>
                    );
                  })}
                </Dropdown>
              </div>
            : <></>}
          </div>
        </div>
      </div>

      <div>
        {error ?
          <div className="flex flex-col justify-between w-full p-4 border border-red-200 rounded-md md:flex-row bg-red-50 dark:bg-red-700 dark:border-red-600">
            <div className="mb-4 md:mb-0 md:me-4">
              <p>Произошла ошибка поиска</p>
            </div>
          </div>
        : <></>}

        {data && data[0].related && <RelatedSection {...data[0].related} />}
        {content ?
          content.length > 0 ?
            params.where == "profiles" ?
              <UserSection content={content} />
            : ["collections_all", "collections_fav"].includes(params.where) ?
              <CollectionsSection content={content} />
            : <ReleaseSection content={content} />
          : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
              <span className="w-24 h-24 iconify-color twemoji--crying-cat"></span>
              <p>Странно, аниме не найдено, попробуйте другой запрос...</p>
            </div>

        : <></>}

        {!content && !isLoading && !query && (
          <div className="flex flex-col items-center justify-center min-w-full gap-2 mt-12 text-xl">
            <span className="w-16 h-16 iconify mdi--arrow-up animate-bounce"></span>
            <p>Введите ваш запрос что-бы найти любимый тайтл</p>
          </div>
        )}

        {isLoading ?
          <div className="flex items-center justify-center w-full h-16">
            <Spinner />
          </div>
        : ""}
      </div>
    </div>
  );
}
