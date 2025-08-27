"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "#/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

export const DiscoverWatchingPage = () => {
  const userStore = useUserStore();
  const router = useRouter();

  const [content, setContent] = useState(null);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;

    let url: string;
    url = `${ENDPOINTS.discover.watching}/${pageIndex}`;

    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }

    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher
  );

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
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <>
      {error ?
        <main className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Ошибка</h1>
            <p className="text-lg">
              Произошла ошибка при загрузке. Попробуйте обновить страницу или
              зайдите позже.
            </p>
          </div>
        </main>
      : !content ?
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      : <ReleaseSection content={content} sectionTitle={"Смотрят сейчас"} />}
      {content && isLoading ?
        <div className="flex flex-col items-center justify-center min-w-full min-h-16">
          <Spinner />
        </div>
      : ""}
    </>
  );
};
