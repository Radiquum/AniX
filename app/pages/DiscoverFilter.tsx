"use client";

import { ENDPOINTS } from "#/api/config";
import { FilterDefault, tryCatchAPI } from "#/api/utils";
import { FiltersModal } from "#/components/Discovery/Modal/FiltersModal";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "#/store/auth";
import { Button } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

const postFetcher = async (url: string, payload: string) => {
  const { data, error } = await tryCatchAPI(
    fetch(url, {
      method: "POST",
      headers: {
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

export const DiscoverFilterPage = () => {
  const userStore = useUserStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(null);
  const [content, setContent] = useState(null);
  const [FooterH, setFooterH] = useState(null);
  const [FiltersModalOpen, setFiltersModalOpen] = useState(false);

  useEffect(() => {
    const queryParams = searchParams.get("filter");
    if (queryParams) {
      try {
        const _filter = JSON.parse(queryParams);
        if (Object.keys(_filter).length != Object.keys(FilterDefault).length) {
          setFilter(FilterDefault);
        } else {
          setFilter(_filter);
        }
      } catch (e) {
        setFilter(FilterDefault);
      }
    } else {
      setFilter(FilterDefault);
    }

    if (window) {
      setFooterH(document.querySelector("footer").clientHeight + 16);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setContent(null);
    const url = new URL(`/discovery/filter`, window.location.origin);
    url.searchParams.set("filter", JSON.stringify(filter));
    router.replace(url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!filter) return null;

    if (previousPageData && !previousPageData.content.length) return null;

    let url = `${ENDPOINTS.filter}/${pageIndex}`;
    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }
    return [url, JSON.stringify(filter)];
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    ([url, payload]) => postFetcher(url, payload),
    { initialSize: 2 }
  );

  useEffect(() => {
    if (data) {
      let _content = [];
      for (let i = 0; i < data.length; i++) {
        _content.push(...data[i].content);
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

  if (!filter) return <></>;

  return (
    <div>
      {error ?
        <div className="flex flex-col justify-between w-full p-4 border border-red-200 rounded-md md:flex-row bg-red-50 dark:bg-red-700 dark:border-red-600">
          <div className="mb-4 md:mb-0 md:me-4">
            <p>Произошла ошибка фильтра</p>
          </div>
        </div>
      : <></>}
      {content ?
        <ReleaseSection content={content} sectionTitle={"Фильтр"} />
      : <></>}
      {isLoading ?
        <div className="flex items-center justify-center w-full h-16">
          <Spinner />
        </div>
      : ""}
      <Button
        color="green"
        pill
        className="fixed bottom-[var(--header-height)] right-4"
        style={{ "--header-height": `${FooterH}px` } as React.CSSProperties}
        onClick={() => setFiltersModalOpen(true)}
      >
        <span className="flex-shrink-0 inline-block w-8 h-8 iconify mdi--mixer-settings"></span>
      </Button>
      <FiltersModal
        isOpen={FiltersModalOpen}
        setIsOpen={setFiltersModalOpen}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};
