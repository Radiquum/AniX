"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import useSWR from "swr";
import { CollectionCourusel } from "../CollectionCourusel/CollectionCourusel";
import { useUserStore } from "#/store/auth";

export const CollectionsOfTheWeek = () => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading, error } = useSWR(
    `${ENDPOINTS.discover.collections}/-1?previous_page=0&where=2&sort=4${token ? `&token=${token}` : ""}`,
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
    <CollectionCourusel
      sectionTitle="Коллекции недели"
      showAllLink={`/discovery/collections?sort=week_popular`}
      content={data.content}
    />
  );
};
