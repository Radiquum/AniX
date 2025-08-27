"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import { ReleaseCourusel } from "../ReleaseCourusel/ReleaseCourusel";
import useSWR from "swr";

export const RecommendedCarousel = () => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading, error } = useSWR(
    token ? `${ENDPOINTS.discover.recommendations}/-1?previous_page=-1&token=${token}` : null,
    useSWRfetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  if (!token) return <></>;
  if (error) return <></>;
  if (isLoading) return <></>;

  return <ReleaseCourusel content={data.content} sectionTitle={"Рекомендации"} showAllLink={"/discovery/recommendations"} />;
};
