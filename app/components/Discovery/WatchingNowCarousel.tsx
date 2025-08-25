"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import { ReleaseCourusel } from "../ReleaseCourusel/ReleaseCourusel";
import useSWR from "swr";

export const WatchingNowCarousel = () => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading, error } = useSWR(
    `${ENDPOINTS.discover.watching}/0${token ? `?token=${token}` : ""}`,
    useSWRfetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) return <></>;
  if (isLoading) return <></>;

  return <ReleaseCourusel content={data.content} sectionTitle={"Смотрят сейчас"} showAllLink={"/discovery/watching"} />;
};
