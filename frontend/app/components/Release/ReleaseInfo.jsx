"use client";

import { useEffect, useState } from "react";
import { getData } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";
import { ReleaseCard } from "../ReleaseCard/ReleaseCard";
import { useUserStore } from "@/app/store/user-store";

export const ReleaseInfo = (props) => {
  const userStore = useUserStore();
  const [releaseInfo, setReleaseInfo] = useState();
  const [list, setList] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [timer, seTimer] = useState();

  useEffect(() => {
    async function _fetchInfo() {
      let url = `${endpoints.release}/${props.id}`;

      if (userStore.token) {
        url = `${endpoints.release}/${props.id}?token=${userStore.token}`;
      }

      const release = await getData(url);
      setReleaseInfo(release);
      if (userStore.token) {
        setList(release.release.profile_list_status || 0);
        setIsFavorite(release.release.is_favorite);
      }
    }

    // I really think it's not the way it is should be done
    // but it works
    // FIX: double requests, 1st without token, and second with it.
    // now it's only 1 request with or w/o token, if page is reloaded.
    if (userStore.token) {
      clearTimeout(timer);
    }
    if (props.id) {
      seTimer(
        setTimeout(() => {
          _fetchInfo();
        }, 1000),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.token]);

  useEffect(() => {
    async function _setList() {
      const url = `${endpoints.user.bookmarks.list}/${list}/${props.id}/add?token=${userStore.token}`;
      await getData(url);
    }
    if (
      userStore.token &&
      releaseInfo &&
      list != releaseInfo.release.profile_list_status
    ) {
      _setList();
      releaseInfo.release.profile_list_status = list;
    }
  }, [userStore.token, list]);

  function _setFav() {
    async function __updateFavorite() {
      const add_url = `${endpoints.user.favorites}/list/${props.id}/add?token=${userStore.token}`;
      const delete_url = `${endpoints.user.favorites}/list/${props.id}/delete?token=${userStore.token}`;
      await getData(!isFavorite ? add_url : delete_url);
    }
    __updateFavorite();
  }

  const lists = [
    { list: 0, name: "Не смотрю" },
    { list: 1, name: "Смотрю" },
    { list: 2, name: "В планах" },
    { list: 3, name: "Просмотрено" },
    { list: 4, name: "Отложено" },
    { list: 5, name: "Брошено" },
  ];

  return (
    <>
      {releaseInfo ? (
        <>
          <article className="no-padding fill">
            <div className="grid no-space">
              <div className="s3">
                <img className="responsive" src={releaseInfo.release.image} />
              </div>
              <div className="s9">
                <div className="padding">
                  <div className="grid">
                    <div className="s9">
                      <h5>{releaseInfo.release.title_ru}</h5>
                      <h6 className="small no-margin">
                        {releaseInfo.release.title_original}
                      </h6>
                    </div>
                    <div className="s3 row right-align">
                      {userStore.token && list >= 0 && (
                        <button className="responsive">
                          <span>{lists[list].name}</span>
                          <i>arrow_drop_down</i>
                          <menu>
                            {lists.map((item) => {
                              return (
                                <a
                                  key={item.list}
                                  onClick={() => {
                                    setList(item.list);
                                  }}
                                >
                                  {item.name}
                                </a>
                              );
                            })}
                          </menu>
                        </button>
                      )}
                      {userStore.token && releaseInfo && (
                        <button
                          className="circle"
                          onClick={() => {
                            setIsFavorite(!isFavorite);
                            _setFav();
                          }}
                        >
                          <i className={isFavorite ? "fill" : ""}>favorite</i>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="small no-margin">
                    {releaseInfo.release.country} •{" "}
                    {releaseInfo.release.status.name} •{" "}
                    {releaseInfo.release.episodes_released}/
                    {releaseInfo.release.episodes_total
                      ? releaseInfo.release.episodes_total
                      : "?"}
                  </p>
                  <p>{releaseInfo.release.description}</p>
                </div>
              </div>
            </div>
          </article>
          {releaseInfo.release.related_releases.length > 0 && (
            <article className="grid">
              <div className="row s12">
                <i>hub</i>
                <h5>Связанные релизы</h5>
              </div>
              <nav className="s12 scroll">
                {releaseInfo.release.related_releases.map((item) => {
                  if (item.id == props.id) {
                    return "";
                  }
                  return (
                    <ReleaseCard
                      className={"s1"}
                      key={item.id}
                      id={item.id}
                      title={item.title_ru}
                      poster={item.image}
                      description={""}
                      height={400}
                    />
                  );
                })}
              </nav>
            </article>
          )}
        </>
      ) : (
        <div className="center-align">
          <progress className="circle" />
        </div>
      )}
    </>
  );
};
