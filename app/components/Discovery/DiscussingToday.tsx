"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import Link from "next/link";
import { PosterWithStuff } from "../ReleasePoster/PosterWithStuff";
import useSWR from "swr";

export const DiscussingToday = () => {
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

  if (error) return <></>;
  if (isLoading) return <></>;

  return (
    <div>
      <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          Обсуждаемое сегодня
        </h1>
      </div>
      <div className="flex gap-2 my-4 overflow-auto">
        {data.content.map((item) => {
          return (
            <Link
              key={`discover-discussing-${item.id}`}
              href={`/release/${item.id}`}
              className="min-w-[256px]"
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
