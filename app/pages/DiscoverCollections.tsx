"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { CollectionsSection } from "#/components/CollectionsSection/CollectionsSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "#/store/auth";
import { Button, ButtonGroup } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

export const DiscoverCollectionsSort = [
  {
    id: "all_time_popular",
    name: "Популярные за всё время",
    where: 1,
    sort: 1,
  },
  {
    id: "year_popular",
    name: "Популярные за год",
    where: 1,
    sort: 2,
  },
  {
    id: "season_popular",
    name: "Популярные за сезон",
    where: 1,
    sort: 3,
  },
  {
    id: "week_popular",
    name: "Популярные за неделю",
    where: 1,
    sort: 4,
  },
  {
    id: "recent",
    name: "Недавно добавленные",
    where: 1,
    sort: 5,
  },
  {
    id: "random",
    name: "Случайные",
    where: 1,
    sort: 6,
  },
];

export const DiscoverCollectionsPage = () => {
  const userStore = useUserStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [previousPage, setPreviousPage] = useState(0);
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "recent"
  );
  const [content, setContent] = useState(null);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;

    let where = null;
    let sort = null;
    let obj = null;
    obj = DiscoverCollectionsSort.find((item) => item.id == selectedSort);

    if (obj) {
      where = obj.where;
      sort = obj.sort;
    } else {
      where = DiscoverCollectionsSort[5].where;
      sort = DiscoverCollectionsSort[5].sort;
    }

    let url: string;
    url = `${ENDPOINTS.discover.collections}/${pageIndex}?where=${where}&sort=${sort}&previous_page=${previousPage}`;

    if (userStore.token) {
      url += `&token=${userStore.token}`;
    }

    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher
  );

  useEffect(() => {
    router.replace("/discovery/collections?sort=" + selectedSort);
    setContent(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort]);

  useEffect(() => {
    if (data) {
      let allContent = [];
      for (let i = 0; i < data.length; i++) {
        allContent.push(...data[i].content);
      }
      setContent(allContent);
    }
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setPreviousPage(size);
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <>
      <div className="mb-4 overflow-x-auto">
          <ButtonGroup>
            {Object.entries(DiscoverCollectionsSort).map(([key, item]) => {
              return (
                <Button
                  key={`discover-collections-sort-${item.id}`}
                  onClick={() => setSelectedSort(item.id)}
                  color={selectedSort == item.id ? "blue" : "light"}
                >
                  {item.name}
                </Button>
              );
            })}
          </ButtonGroup>
      </div>
      {error ?
        <main className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Ошибка</h1>
            <p className="text-lg">
              Произошла ошибка при загрузке коллекций. Попробуйте обновить
              страницу или зайдите позже.
            </p>
          </div>
        </main>
      : isLoading || !content ?
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      : <CollectionsSection content={content} sectionTitle={"Коллекции"} />}
    </>
  );
};
