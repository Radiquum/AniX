"use client";

import { getData } from "./api/api-utils";
import { endpoints } from "./api/config";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CardList } from "./components/CardList/CardList";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const [list, setList] = useState();
  const [releases, setReleases] = useState();
  const [page, setPage] = useState(0);

  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // set list on initial page load
  useEffect(() => {
    setList(searchParams.get("list") || "last");
  }, []);

  async function fetchData(list, page = 0) {
    const url = `${endpoints.index[list]}?page=${page}`;
    const data = await getData(url);

    // Handle initial load (page 0) or subsequent pagination
    if (page === 0) {
      setReleases(data.content);
    } else {
      setReleases([...releases, ...data.content]);
    }
  }

  useEffect(() => {
    router.push(pathname + "?" + createQueryString("list", list));
    setReleases(null);
    setPage(0);
    fetchData(list); // Call fetchData here
  }, [list]);

  useEffect(() => {
    if (list && releases) {
      fetchData(list, page); // Use fetchData for pagination
    }
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
    <>
      <div>
        {chips.map((item) => {
          return (
            <button
              className={`chip ${list == item.list ? "fill" : ""}`}
              onClick={() => {
                setList(item.list);
              }}
            >
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {releases ? (
        <>
          <div className="grid">
            <CardList data={releases} />
          </div>

          <nav className="large-margin center-align">
            <button
              className="large"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              <i>add</i>
              <span>загрузить ещё</span>
            </button>
          </nav>
        </>
      ) : (
        <progress className="s1"></progress>
      )}
    </>
  );
}
