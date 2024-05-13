"use client";

import { getData } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ReleasesOverview from "@/app/components/ReleasesOverview/ReleasesOverview";

export default function IndexPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [list, setList] = useState();
  const [releases, setReleases] = useState();
  const [page, setPage] = useState(0);

  const [isNextPage, setIsNextPage] = useState(true);

  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  // set list on initial page load
  useEffect(() => {
    const query = searchParams.get("list");
    if (query) {
      setList(query);
    } else {
      setList("last");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData(list, page = 0) {
    const url = `${endpoints.index[list]}?page=${page}`;
    const data = await getData(url);

    if (data.content.length < 25) {
      setIsNextPage(false);
    } else {
      setIsNextPage(true);
    }

    // Handle initial load (page 0) or subsequent pagination
    if (page === 0) {
      setReleases(data.content);
    } else {
      setReleases([...releases, ...data.content]);
    }
  }

  useEffect(() => {
    if (list) {
      router.push(pathname + "?" + createQueryString("list", list));
      setReleases(null);
      setPage(0);
      fetchData(list); // Call fetchData here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    if (list && releases) {
      fetchData(list, page); // Use fetchData for pagination
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const chips = [
    {
      title: "последнее",
      list: "last",
    },
    {
      title: "в эфире",
      list: "ongoing",
    },
    {
      title: "анонсировано",
      list: "announce",
    },
    {
      title: "завершено",
      list: "finished",
    },
  ];

  return (
    <ReleasesOverview
      chips={chips}
      setList={setList}
      page={page}
      setPage={setPage}
      list={list}
      releases={releases}
      isNextPage={isNextPage}
    />
  );
}
