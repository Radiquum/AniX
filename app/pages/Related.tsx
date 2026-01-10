"use client";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { ENDPOINTS } from "#/api/config";
import { getFixedGrade, getUserList, useSWRfetcher } from "#/api/utils";
import { ReleaseChips } from "#/components/ReleasePoster/Chips";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";

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
        <Timeline
          horizontal
          className="!grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 !gap-2"
        >
          {content ?
            content.map((release) => {
              const grade = getFixedGrade(release.grade);
              const profile_list_status = release.profile_list_status || null;
              const user_list = getUserList(profile_list_status);

              return (
                <TimelineItem
                  key={`related-release-${release.id}`}
                  className="p-2 border-2 border-black border-opacity-25 rounded-lg dark:border-opacity-25 dark:border-white"
                >
                  <TimelineContent>
                    <TimelineTime>
                      {release.season ? YearSeason[release.season] : ""}
                      {release.season ? ", " : ""}
                      {release.year ? `${release.year}г.` : ""} |{" "}
                      {release.genres}
                    </TimelineTime>
                    <TimelineTitle>
                      {release.title_ru || release.title_original}
                    </TimelineTitle>
                    <TimelineBody>
                      <div className="flex flex-col gap-4 my-2">
                        <div className="flex justify-center gap-2">
                          <Image
                            src={release.image}
                            width={9 * 24}
                            height={16 * 24}
                            alt=""
                            className="object-cover aspect-[12/16] rounded-lg"
                          />
                          <div className="flex flex-col w-full">
                            <ReleaseChips
                              {...release}
                              user_list={user_list}
                              grade={grade}
                              settings={{ column: true }}
                            />
                            <Link href={`/release/${release.id}`}  className="w-full mt-auto">
                              <Button color={"blue"} className="w-full">
                                <span className="mr-2">Перейти</span>
                                <span className="w-6 h-6 iconify mdi--arrow-right"></span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <p className="line-clamp-3">{release.description}</p>
                      </div>
                    </TimelineBody>
                  </TimelineContent>
                </TimelineItem>
              );
            })
          : isLoading ?
            <div className="flex flex-col items-center justify-center min-w-full min-h-screen sm:col-span-2">
              <Spinner />
            </div>
          : ""}
        </Timeline>
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
