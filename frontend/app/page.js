"use client";

import { ReleaseCard } from "./components/ReleaseCard/ReleaseCard";
import { getData } from "./api/api-utils";
import { endpoints } from "./api/config";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const searchParams = useSearchParams();
  const [list, setList] = useState("last");
  const [releases, setReleases] = useState(null);

  useEffect(() => {
    async function getReleases() {
      setReleases(await getData(endpoints.index[list]));
    }
    setReleases(null);
    getReleases();
  }, [list]);

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
        {releases
          ? releases.content.map((item) => {
              return (
                <ReleaseCard
                  id={item.id}
                  title={item.title_ru}
                  poster={item.image}
                  description={item.description}
                />
              );
            })
          : ""}
      </div>
    </>
  );
}
