"use client";
import useSWR from "swr";
import { CollectionCourusel } from "#/components/CollectionCourusel/CollectionCourusel";
import { Spinner } from "#/components/Spinner/Spinner";
import { useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import { ENDPOINTS } from "#/api/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CollectionsPage() {
  const userStore = useUserStore();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");

  function useFetchReleases(section: string) {
    let url: string;

    if (userStore.token && userStore.user) {
      if (section == "userCollections") {
        url = `${ENDPOINTS.collection.userCollections}/${userStore.user.id}/0?token=${userStore.token}`;
      } else if (section == "userFavoriteCollections") {
        url = `${ENDPOINTS.collection.favoriteCollections}/all/0?token=${userStore.token}`;
      }
    }

    const { data, error } = useSWR(url, useSWRfetcher);
    return [data, error];
  }

  const [userCollections, userCollectionsError] =
    useFetchReleases("userCollections");
  const [favoriteCollections, favoriteCollectionsError] = useFetchReleases(
    "userFavoriteCollections"
  );

  useEffect(() => {
    if (userStore.state === "finished" && !userStore.token) {
      router.push("/login?redirect=/collections");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.state, userStore.token]);

  return (
    <>
      {userStore.state === "loading" &&
        (!userCollections || !favoriteCollections) && (
          <div className="flex items-center justify-center min-w-full min-h-screen">
            <Spinner />
          </div>
        )}

      <form
        className="flex-1 max-w-full mx-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(
            `/search?query=${searchVal}&params={"where"%3A"collections_fav"%2C"searchBy"%3A"none"}`
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
            placeholder="Поиск коллекций..."
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

      {userCollections && userCollections.content && (
        <CollectionCourusel
          sectionTitle="Мои коллекции"
          showAllLink={`/profile/${userStore.user.id}/collections`}
          content={userCollections.content}
          isMyCollections={true}
        />
      )}
      {favoriteCollections &&
        favoriteCollections.content &&
        favoriteCollections.content.length > 0 && (
          <CollectionCourusel
            sectionTitle="Избранные коллекции"
            showAllLink="/collections/favorites"
            content={favoriteCollections.content}
          />
        )}

      {(userCollectionsError || favoriteCollectionsError) && (
        <main className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Ошибка</h1>
            <p className="text-lg">
              Произошла ошибка при загрузке коллекций. Попробуйте обновить
              страницу или зайдите позже.
            </p>
          </div>
        </main>
      )}
    </>
  );
}
