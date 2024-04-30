"use client";

import { useEffect, useState } from "react";
import { getData } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";
import { ReleaseCard } from "../ReleaseCard/ReleaseCard";

export const ReleaseInfo = (props) => {
  const [releaseInfo, setReleaseInfo] = useState();

  useEffect(() => {
    async function _fetchInfo() {
      const release = await getData(`${endpoints.release}/${props.id}`);
      setReleaseInfo(release);
    }
    if (props.id) {
      _fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <h5>{releaseInfo.release.title_ru}</h5>
                  <h6 className="small no-margin">
                    {releaseInfo.release.title_original}
                  </h6>
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
        </>
      ) : (
        <div className="center-align">
          <progress className="circle" />
        </div>
      )}
    </>
  );
};
