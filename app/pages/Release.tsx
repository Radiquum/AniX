"use client";

import useSWR from "swr";
import { Spinner } from "#/components/Spinner/Spinner";
import { useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";

import { ReleaseInfoBasics } from "#/components/ReleaseInfo/ReleaseInfo.Basics";
import { ReleaseInfoInfo } from "#/components/ReleaseInfo/ReleaseInfo.Info";
import { ReleasePlayer } from "#/components/ReleasePlayer/ReleasePlayer";
import { ReleasePlayerCustom } from "#/components/ReleasePlayer/ReleasePlayerCustom";
import { ReleaseInfoUserList } from "#/components/ReleaseInfo/ReleaseInfo.UserList";
import { ReleaseInfoRating } from "#/components/ReleaseInfo/ReleaseInfo.Rating";
import { ReleaseInfoRelated } from "#/components/ReleaseInfo/ReleaseInfo.Related";
import { ReleaseInfoScreenshots } from "#/components/ReleaseInfo/ReleaseInfo.Screenshots";
import { CommentsMain } from "#/components/Comments/Comments.Main";
import { InfoLists } from "#/components/InfoLists/InfoLists";
import { ENDPOINTS } from "#/api/config";
import { usePreferencesStore } from "#/store/preferences";
import { ContinueWatching } from "#/components/ContinueWatching/ContinueWatching";
import { ShareButton } from "#/components/FloatingToolbar/ShareButton";
import { FloatingToolbar } from "#/components/FloatingToolbar/FloatingToolbar";

export const ReleasePage = (props: any) => {
  const userStore = useUserStore();
  const preferenceStore = usePreferencesStore();
  const [userList, setUserList] = useState(0);
  const [userFavorite, setUserFavorite] = useState(false);

  function useFetch(id: number) {
    let url: string;

    url = `${ENDPOINTS.release.info}/${id}`;
    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }
    const { data, isLoading, error } = useSWR(url, useSWRfetcher);
    return [data, isLoading, error];
  }
  const [data, isLoading, error] = useFetch(props.id);

  useEffect(() => {
    if (data) {
      const el = document.getElementById("note");
      if (el) {
        el.innerHTML = data.release.note;
      }
      setUserList(data.release.profile_list_status || 0);
      setUserFavorite(data.release.is_favorite);
    }
  }, [data]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ошибка</h1>
          <p className="text-lg">
            Произошла ошибка при загрузке релиза. Попробуйте обновить страницу
            или зайдите позже.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-2 grid-flow-row-dense">
        <ReleaseInfoBasics
          image={data.release.image}
          title={{
            ru: data.release.title_ru,
            original: data.release.title_original,
          }}
          description={data.release.description}
          note={data.release.note}
          release_id={data.release.id}
        />
        <ReleaseInfoInfo
          country={data.release.country}
          aired_on_date={data.release.aired_on_date}
          year={data.release.year}
          episodes={{
            total: data.release.episodes_total,
            released: data.release.episodes_released,
          }}
          season={data.release.season}
          status={data.release.status ? data.release.status.name : "Анонс"}
          duration={data.release.duration}
          category={data.release.category.name}
          broadcast={data.release.broadcast}
          studio={data.release.studio}
          author={data.release.author}
          director={data.release.director}
          genres={data.release.genres}
        />
        <ReleaseInfoUserList
          userList={userList}
          isFavorite={userFavorite}
          release_id={data.release.id}
          token={userStore.token}
          profile_id={userStore.user ? userStore.user.id : null}
          setUserList={setUserList}
          setIsFavorite={setUserFavorite}
          collection_count={data.release.collection_count}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-2 grid-flow-row-dense">
        <div className="flex flex-col gap-2">
          {data.release.status &&
            data.release.status.name.toLowerCase() != "анонс" && (
              <>
                {preferenceStore.params.experimental.newPlayer ?
                  <ReleasePlayerCustom
                    id={props.id}
                    token={userStore.token}
                    title={
                      data.release.title_ru || data.release.title_original || ""
                    }
                  />
                : <ReleasePlayer id={props.id} />}
              </>
            )}
          <div className="hidden lg:block">
            <CommentsMain
              release_id={props.id}
              token={userStore.token}
              comments={data.release.comments}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.release.status &&
            data.release.status.name.toLowerCase() != "анонс" && (
              <div className="[grid-column:2]">
                <ReleaseInfoRating
                  release_id={props.id}
                  grade={data.release.grade}
                  token={userStore.token}
                  votes={{
                    1: data.release.vote_1_count,
                    2: data.release.vote_2_count,
                    3: data.release.vote_3_count,
                    4: data.release.vote_4_count,
                    5: data.release.vote_5_count,
                    total: data.release.vote_count,
                    user: data.release.your_vote,
                  }}
                />
              </div>
            )}
          <InfoLists
            completed={data.release.completed_count}
            planned={data.release.plan_count}
            abandoned={data.release.dropped_count}
            delayed={data.release.hold_on_count}
            watching={data.release.watching_count}
          />
          {data.release.screenshot_images.length > 0 && (
            <ReleaseInfoScreenshots images={data.release.screenshot_images} />
          )}
          {data.release.related_releases.length > 0 && (
            <ReleaseInfoRelated
              release_id={props.id}
              related={data.release.related}
              related_releases={data.release.related_releases}
            />
          )}
          {userStore.token && <ContinueWatching />}
          <div className="block lg:hidden">
            <CommentsMain
              release_id={props.id}
              token={userStore.token}
              comments={data.release.comments}
            />
          </div>
        </div>
      </div>
      <FloatingToolbar>
        <ShareButton
          text={`Смотреть '${data.release.title_ru || data.release.title_original} (${data.release.year || "?"}г.)' на Anixart`}
        />
      </FloatingToolbar>
    </div>
  );
};
