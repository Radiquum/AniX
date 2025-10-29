"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { Button, ButtonGroup, Dropdown, DropdownItem } from "flowbite-react";
import { sort } from "./common";
import { ENDPOINTS } from "#/api/config";
import { BookmarksList, useSWRfetcher } from "#/api/utils";
import { useRouter } from "next/navigation";

const DropdownTheme = {
  floating: {
    target: "w-fit md:min-w-[256px]",
  },
};

export function BookmarksCategoryPage(props: any) {
  const token = useUserStore((state) => state.token);
  const authState = useUserStore((state) => state.state);
  const [selectedSort, setSelectedSort] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const router = useRouter();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url: string;
    if (props.profile_id) {
      url = `${ENDPOINTS.user.bookmark}/all/${props.profile_id}/${
        BookmarksList[props.slug]
      }/${pageIndex}?sort=${sort.values[selectedSort].id}`;
      if (token) {
        url += `&token=${token}`;
      }
    } else {
      if (token) {
        url = `${ENDPOINTS.user.bookmark}/all/${
          BookmarksList[props.slug]
        }/${pageIndex}?sort=${sort.values[selectedSort].id}&token=${token}`;
      }
    }
    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 2 }
  );

  const [content, setContent] = useState(null);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].content);
      }
      setContent(allReleases);
    }
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  useEffect(() => {
    if (authState === "finished" && !token && !props.profile_id) {
      router.push(`/login?redirect=/bookmarks/${props.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ошибка</h1>
          <p className="text-lg">
            Произошла ошибка при загрузке закладок. Попробуйте обновить страницу
            или зайдите позже.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {!props.profile_id ?
        <form
          className="flex-1 max-w-full mx-4"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              `/search?query=${searchVal}&params={"where"%3A"list"%2C"searchBy"%3A"${props.slug}"}`
            );
          }}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
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
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Поиск
            </button>
          </div>
        </form>
      : ""}
      <div className="m-4 overflow-auto">
        <ButtonGroup>
          <Button
            className="whitespace-nowrap"
            disabled={props.slug == "watching"}
            color="light"
            onClick={() =>
              router.push(
                props.profile_id ?
                  `/profile/${props.profile_id}/bookmarks/watching`
                : "/bookmarks/watching"
              )
            }
          >
            {props.SectionTitleMapping["watching"]}
          </Button>
          <Button
            className="whitespace-nowrap"
            disabled={props.slug == "planned"}
            color="light"
            onClick={() =>
              router.push(
                props.profile_id ?
                  `/profile/${props.profile_id}/bookmarks/planned`
                : "/bookmarks/planned"
              )
            }
          >
            {props.SectionTitleMapping["planned"]}
          </Button>
          <Button
            className="whitespace-nowrap"
            disabled={props.slug == "watched"}
            color="light"
            onClick={() =>
              router.push(
                props.profile_id ?
                  `/profile/${props.profile_id}/bookmarks/watched`
                : "/bookmarks/watched"
              )
            }
          >
            {props.SectionTitleMapping["watched"]}
          </Button>
          <Button
            className="whitespace-nowrap"
            disabled={props.slug == "delayed"}
            color="light"
            onClick={() =>
              router.push(
                props.profile_id ?
                  `/profile/${props.profile_id}/bookmarks/delayed`
                : "/bookmarks/delayed"
              )
            }
          >
            {props.SectionTitleMapping["delayed"]}
          </Button>
          <Button
            className="whitespace-nowrap"
            disabled={props.slug == "abandoned"}
            color="light"
            onClick={() =>
              router.push(
                props.profile_id ?
                  `/profile/${props.profile_id}/bookmarks/abandoned`
                : "/bookmarks/abandoned"
              )
            }
          >
            {props.SectionTitleMapping["abandoned"]}
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black dark:border-white">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          {props.SectionTitleMapping[props.slug]}
        </h1>
        <Dropdown
          label={sort.values[selectedSort].name}
          dismissOnClick={true}
          arrowIcon={false}
          color={"blue"}
          size={"sm"}
          theme={DropdownTheme}
          className="z-40"
        >
          {sort.values.map((item, index) => (
            <DropdownItem key={index} onClick={() => setSelectedSort(index)}>
              <span
                className={`w-6 h-6 iconify ${
                  sort.values[index].value.split("_")[1] == "descending" ?
                    sort.descendingIcon
                  : sort.ascendingIcon
                }`}
              ></span>
              {item.name}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>
      {content && content.length > 0 ?
        <ReleaseSection content={content} />
      : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>
            В списке {props.SectionTitleMapping[props.slug]} пока ничего нет...
          </p>
        </div>
      }
      {data &&
        data[data.length - 1].current_page <
          data[data.length - 1].total_page_count && (
          <Button
            className="w-full"
            color={"light"}
            onClick={() => setSize(size + 1)}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 iconify mdi--plus-circle "></span>
              <span className="text-lg">Загрузить ещё</span>
            </div>
          </Button>
        )}
    </>
  );
}
