"use client";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { FetchFilter } from "#/api/utils";
import { Button, ButtonGroup } from "flowbite-react";
import { useRouter } from "next/navigation";
import { slugToFilter } from "./IndexFilters";

export function IndexCategoryPage(props) {
  const token = useUserStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function _loadInitialReleases() {
      setIsLoading(true);
      setContent(null);

      const [ data ] = await FetchFilter(slugToFilter[props.slug].filter, page, token);

      setContent(data.content);
      setIsLoading(false);
    }

    _loadInitialReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    async function _loadNextReleasesPage() {
      const [ data ] = await FetchFilter(slugToFilter[props.slug].filter, page, token);
      const newContent = [...content, ...data.content];
      setContent(newContent);
    }
    if (content) {
      _loadNextReleasesPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition == 98) {
      setPage(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <>
      <div className="mb-4 overflow-auto">
        <ButtonGroup>
          <Button className="whitespace-nowrap" disabled={props.slug == "last"} color="light" onClick={() => router.push("/home/last")}>{props.SectionTitleMapping["last"]}</Button>
          <Button className="whitespace-nowrap" disabled={props.slug == "finished"} color="light" onClick={() => router.push("/home/finished")}>{props.SectionTitleMapping["finished"]}</Button>
          <Button className="whitespace-nowrap" disabled={props.slug == "ongoing"} color="light" onClick={() => router.push("/home/ongoing")}>{props.SectionTitleMapping["ongoing"]}</Button>
          <Button className="whitespace-nowrap" disabled={props.slug == "announce"} color="light" onClick={() => router.push("/home/announce")}>{props.SectionTitleMapping["announce"]}</Button>
          <Button className="whitespace-nowrap" disabled={props.slug == "films"} color="light" onClick={() => router.push("/home/films")}>{props.SectionTitleMapping["films"]}</Button>
        </ButtonGroup>
      </div>
      {content && content.length > 0 ? (
        <ReleaseSection
          sectionTitle={props.SectionTitleMapping[props.slug]}
          content={content}
        />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>
            В списке {props.SectionTitleMapping[props.slug]} пока ничего нет...
          </p>
        </div>
      )}
      <Button
        className="w-full"
        color={"light"}
        onClick={() => setPage(page + 1)}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 iconify mdi--plus-circle "></span>
          <span className="text-lg">Загрузить ещё</span>
        </div>
      </Button>
    </>
  );
}
