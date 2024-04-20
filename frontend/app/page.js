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

  useEffect(() => {
    setList(searchParams.get("list") || "last");
  }, []);

  async function getReleases() {
    const data = await getData(`${endpoints.index[list]}`);
    setReleases(data.content);
  }

  async function getPage() {
    const data = await getData(`${endpoints.index[list]}?page=${page}`);
    setReleases([...releases, ...data.content]);
  }

  useEffect(() => {
    router.push(pathname + "?" + createQueryString("list", list));
    setReleases(null);
    setPage(0);
    if (list) {
      getReleases();
    }
  }, [list]);

  useEffect(() => {
    if (list && releases) {
      getPage();
    }
  }, [page]);

  return (
    <>
      <div>
        <button
          className={`chip ${list == "last" ? "fill" : ""}`}
          onClick={() => {
            setList("last");
          }}
        >
          <span>последнее</span>
        </button>
        <button
          className={`chip ${list == "ongoing" ? "fill" : ""}`}
          onClick={() => {
            setList("ongoing");
          }}
        >
          <span>в эфире</span>
        </button>
        <button
          className={`chip ${list == "announce" ? "fill" : ""}`}
          onClick={() => {
            setList("announce");
          }}
        >
          <span>анонсировано</span>
        </button>
        <button
          className={`chip ${list == "finished" ? "fill" : ""}`}
          onClick={() => {
            setList("finished");
          }}
        >
          <span>завершено</span>
        </button>
      </div>

      <div className="grid">
        {releases ? <CardList data={releases} /> : <progress></progress>}
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
  );
}
