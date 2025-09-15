"use client";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { ReleaseChips } from "#/components/ReleasePoster/Chips";
import Link from "next/link";
import Image from "next/image";

const profile_lists = {
  // 0: "Не смотрю",
  1: { name: "Смотрю", bg_color: "bg-green-500" },
  2: { name: "В планах", bg_color: "bg-purple-500" },
  3: { name: "Просмотрено", bg_color: "bg-blue-500" },
  4: { name: "Отложено", bg_color: "bg-yellow-500" },
  5: { name: "Брошено", bg_color: "bg-red-500" },
};
const YearSeason = ["_", "Зима", "Весна", "Лето", "Осень"];

export function RelatedPage(props: { id: number | string; title: string }) {
  const token = useUserStore((state) => state.token);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `${ENDPOINTS.release.related}/${props.id}/${pageIndex}?token=${token}&API-Version=v2`;
    }
    return `${ENDPOINTS.release.related}/${props.id}/${pageIndex}?API-Version=v2`;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 1 }
  );

  const [content, setContent] = useState(null);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].content);
      }
      setContent(allReleases);
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
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black dark:border-white">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          Франшиза {props.title}
        </h1>
      </div>
      <div className="container mx-auto my-4">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {content ?
            content.map((release, index) => {
              const genres = [];
              const grade =
                release.grade ? Number(release.grade.toFixed(1)) : null;
              const profile_list_status = release.profile_list_status || null;
              let user_list = null;
              if (profile_list_status != null || profile_list_status != 0) {
                user_list = profile_lists[profile_list_status];
              }
              if (release.genres) {
                const genres_array = release.genres.split(",");
                genres_array.forEach((genre) => {
                  genres.push(genre.trim());
                });
              }
              return (
                <Link
                  href={`/release/${release.id}`}
                  key={`related-release-${release.id}`}
                  className="relative pr-2 overflow-hidden bg-gray-100 rounded-lg dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <Image
                      src={release.image}
                      width={9 * 24}
                      height={16 * 24}
                      alt=""
                      className="object-cover aspect-[12/16] mx-auto rounded-lg mt-4 lg:mt-0"
                    />
                    <div className="px-2 pb-2">
                      <div>
                        <h1 className="mt-1 text-2xl font-bold lg:text-3xl line-clamp-2">
                          {index + 1}.{" "}
                          {release.title_ru || release.title_original}
                        </h1>
                        <p className="mb-2 text-lg lg:mb-1 lg:-mt-1">
                          {release.season ? YearSeason[release.season] : ""}
                          {release.season ? ", " : ""}
                          {release.year ? `${release.year}г.` : ""}
                        </p>
                        <ReleaseChips
                          {...release}
                          user_list={user_list}
                          grade={grade}
                        />
                      </div>
                      <div>
                        <div className="mt-2">
                          {genres.length > 0 &&
                            genres.map((genre: string, index: number) => {
                              return (
                                <span
                                  key={`release_${props.id}_genre_${genre}_${index}`}
                                  className="dark:text-white md:text-sm lg:text-base xl:text-lg"
                                >
                                  {index > 0 && ", "}
                                  {genre}
                                </span>
                              );
                            })}
                        </div>
                        {release.description && (
                          <p className="mt-2 text-sm font-light dark:text-white lg:text-base xl:text-lg line-clamp-3">
                            {release.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          : isLoading ?
            <div className="flex flex-col items-center justify-center min-w-full min-h-screen sm:col-span-2">
              <Spinner />
            </div>
          : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
              <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
              <p>В франшизе пока ничего нет...</p>
            </div>
          }
        </div>
      </div>
      {data &&
        data[data.length - 1].current_page <
          data[data.length - 1].total_page_count && (
          <button
            className="mx-auto w-[calc(100%-10rem)] border border-black rounded-lg p-2 mb-6 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
            onClick={() => setSize(size + 1)}
          >
            <span className="w-10 h-10 iconify mdi--plus"></span>
            <span className="text-lg">Загрузить ещё</span>
          </button>
        )}
    </>
  );
}
