"use client";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { ENDPOINTS } from "#/api/config";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";

import { CollectionInfoBasics } from "#/components/CollectionInfo/CollectionInfo.Basics";
import { InfoLists } from "#/components/InfoLists/InfoLists";
import { CollectionInfoControls } from "#/components/CollectionInfo/CollectionInfoControls";
import { CommentsMain } from "#/components/Comments/Comments.Main";

import { useSWRfetcher } from "#/api/utils";
import { ShareButton } from "#/components/ShareButton/ShareButton";

export const ViewCollectionPage = (props: { id: number }) => {
  const userStore = useUserStore();

  function useFetchCollectionInfo(type: "info" | "comments") {
    let url: string;

    if (type == "info") {
      url = `${ENDPOINTS.collection.base}/${props.id}`;
    } else if (type == "comments") {
      url = `${ENDPOINTS.collection.base}/comment/all/${props.id}/0?sort=3`;
    }

    if (userStore.token) {
      url += `${type != "info" ? "&" : "?"}token=${userStore.token}`;
    }

    const { data, error, isLoading } = useSWR(url, useSWRfetcher);
    return [data, error, isLoading];
  }
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url: string = `${ENDPOINTS.collection.base}/${props.id}/releases/${pageIndex}`;
    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }
    return url;
  };

  const [collectionInfo, collectionInfoError, collectionInfoIsLoading] =
    useFetchCollectionInfo("info");
  const [
    collectionComments,
    collectionCommentsError,
    collectionCommentsIsLoading,
  ] = useFetchCollectionInfo("comments");

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 2 }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || collectionInfoError) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ошибка</h1>
          <p className="text-lg">
            Произошла ошибка при загрузке коллекции. Попробуйте обновить
            страницу или зайдите позже.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {collectionInfoIsLoading ?
        <div className="flex items-center justify-center w-full h-screen">
          <Spinner />
        </div>
      : collectionInfo && (
          <>
            <div className="flex flex-col flex-wrap gap-2 px-2 pb-2 sm:flex-row">
              <CollectionInfoBasics
                image={collectionInfo.collection.image}
                title={collectionInfo.collection.title}
                description={collectionInfo.collection.description}
                authorAvatar={collectionInfo.collection.creator.avatar}
                authorLogin={collectionInfo.collection.creator.login}
                authorId={collectionInfo.collection.creator.id}
                creationDate={collectionInfo.collection.creation_date}
                updateDate={collectionInfo.collection.last_update_date}
              />
              <div className="flex flex-col gap-2 w-full max-w-full lg:max-w-[48%]">
                {collectionComments && !collectionCommentsIsLoading && (
                  <CommentsMain
                    release_id={props.id}
                    token={userStore.token}
                    comments={collectionComments.content.slice(0, 2)}
                    type="collection"
                  />
                )}
                {userStore.token && !isLoading && (
                  <>
                    <InfoLists
                      completed={collectionInfo.completed_count}
                      planned={collectionInfo.plan_count}
                      abandoned={collectionInfo.dropped_count}
                      delayed={collectionInfo.hold_on_count}
                      watching={collectionInfo.watching_count}
                      total={data[0].total_count}
                    />
                    <CollectionInfoControls
                      isFavorite={collectionInfo.collection.is_favorite}
                      id={collectionInfo.collection.id}
                      authorId={collectionInfo.collection.creator.id}
                      isPrivate={collectionInfo.collection.is_private}
                    />
                  </>
                )}
              </div>
            </div>
            {content && (
              <ReleaseSection
                sectionTitle={"Релизов в коллекции: " + data[0].total_count}
                content={content}
              />
            )}
            <ShareButton text={`Коллекция '${collectionInfo.collection.title}' на Anixart`} />
          </>
        )
      }
    </>
  );
};
