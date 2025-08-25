"use client";
import useSWRInfinite from "swr/infinite";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { ENDPOINTS } from "#/api/config";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useSWRfetcher } from "#/api/utils";

export function HistoryPage() {
  const token = useUserStore((state) => state.token);
  const authState = useUserStore((state) => state.state);
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `${ENDPOINTS.user.history}/${pageIndex}?token=${token}`;
    }
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
    if (authState === "finished" && !token) {
      router.push("/login?redirect=/history");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, token]);

  return (
    <>
      <form
        className="flex-1 max-w-full mx-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(
            `/search?query=${searchVal}&params={"where"%3A"history"%2C"searchBy"%3A"none"}`
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
      {content && content.length > 0 ?
        <>
          <ReleaseSection sectionTitle="История" content={content} />
          {data && data[0].total_count != content.length && (
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
      : isLoading ?
        <div className="flex flex-col items-center justify-center min-w-full min-h-[100dvh]">
          <Spinner />
        </div>
      : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>В истории пока ничего нет...</p>
        </div>
      }
    </>
  );
}
