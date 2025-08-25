"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import Link from "next/link";
import { PosterWithStuff } from "../ReleasePoster/PosterWithStuff";
import useSWR from "swr";

export const DiscussingTodayCarousel = () => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading, error } = useSWR(
    `${ENDPOINTS.discover.discussing}${token ? `?token=${token}` : ""}`,
    useSWRfetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  if (error)
    return (
      <div className="flex flex-col justify-between w-full p-4 border border-red-200 rounded-md md:flex-row bg-red-50 dark:bg-red-700 dark:border-red-600">
        <div className="mb-4 md:mb-0 md:me-4">
          <p>Произошла ошибка загрузки обсуждаемых релизов</p>
        </div>
      </div>
    );
  if (isLoading) return <></>;

  return (
    <div>
      <p className="mb-2 text-lg font-bold">Обсуждаемое сегодня</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {data.content.map((item) => {
          return (
            <Link
              key={`discover-discussing-${item.id}`}
              href={`/release/${item.id}`}
            >
              <PosterWithStuff
                settings={{ showDescription: false, showGenres: false }}
                {...item}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
