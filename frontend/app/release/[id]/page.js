"use client";

import { useEffect, useState } from "react";
import { getData } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";
import { useUserStore } from "@/app/store/user-store";
import { useSettingsStore } from "@/app/store/settings-store";

export default function Release(props) {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  const [releaseInfo, setReleaseInfo] = useState();
  const [voiceoverInfo, setVoiceoverInfo] = useState();
  const [selectedVoiceover, setSelectedVoiceover] = useState();
  const [sourcesInfo, setSourcesInfo] = useState();
  const [selectedSources, setSelectedSources] = useState();
  const [episodeInfo, setEpisodeInfo] = useState();
  const [selectedEpisode, setSelectedEpisode] = useState();
  const [episodeURL, setEpisodeURL] = useState();

  useEffect(() => {
    async function _fetchInfo() {
      const release = await getData(`${endpoints.release}/${props.params.id}`);
      const voiceover = await getData(
        `${endpoints.release}/${props.params.id}/voiceover`,
      );
      setReleaseInfo(release);
      setVoiceoverInfo(voiceover);
      setSelectedVoiceover(voiceover.types[0].id);
    }
    if (props.params.id) {
      _fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function _fetchInfo() {
      const sources = await getData(
        `${endpoints.release}/${props.params.id}/${selectedVoiceover}`,
      );
      setSourcesInfo(sources);
      setSelectedSources(sources.sources[0].id);
    }
    if (selectedVoiceover) {
      _fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoiceover]);

  useEffect(() => {
    async function _fetchInfo() {
      let url = `${endpoints.release}/${props.params.id}/${selectedVoiceover}/${selectedSources}`;
      if (userStore.token) {
        url = `${endpoints.release}/${props.params.id}/${selectedVoiceover}/${selectedSources}?token=${userStore.token}`;
      }

      const episodes = await getData(url);

      setEpisodeInfo(episodes);
      setSelectedEpisode(episodes.episodes[0].position);
      setEpisodeURL(episodes.episodes[0].url);
    }
    if (selectedSources) {
      _fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSources, userStore.token]);

  useEffect(() => {
    async function _markAsWatched() {
      const url = `${endpoints.release}/${props.params.id}/${selectedSources}/${selectedEpisode}`;
      await getData(`${url}/saveToHistory?token=${userStore.token}`);
    }
    if (userStore.token && settingsStore.saveToHistory) {
      _markAsWatched();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEpisode]);

  return (
    <article className="fill grid">
      <iframe
        src={episodeURL}
        className="s9"
        style={{ aspectRatio: "16/9", width: "100%", height: "auto" }}
      />
      <div className="s3">
        <div className="tabs">
          <a data-ui="#vo" className="active">
            озвучка
          </a>
          {sourcesInfo && <a data-ui="#src">плеер</a>}
        </div>
        <div
          className="page padding active scroll"
          style={{ Height: "438px" }}
          id="vo"
        >
          {voiceoverInfo &&
            voiceoverInfo.types.map((item) => {
              return (
                <button
                  key={item.id}
                  className={`small responsive ${
                    item.id == selectedVoiceover ? "primary" : "secondary"
                  }`}
                  style={{ marginTop: "8px" }}
                  onClick={() => {
                    setSelectedVoiceover(item.id);
                  }}
                >
                  {item.name}
                </button>
              );
            })}
        </div>
        {sourcesInfo && (
          <div className="page center-align padding" id="src">
            {sourcesInfo.sources.map((item) => {
              return (
                <button
                  key={item.id}
                  className={`small responsive ${
                    item.id == selectedSources ? "primary" : "secondary"
                  }`}
                  style={{ marginTop: "8px" }}
                  onClick={() => {
                    setSelectedSources(item.id);
                  }}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="s12 scroll row" style={{ paddingBottom: "8px" }}>
        {episodeInfo &&
          episodeInfo.episodes.map((item) => {
            return (
              <button
                key={item.position}
                className={`${
                  item.position == selectedEpisode ? "primary" : "secondary"
                }`}
                onClick={() => {
                  setSelectedEpisode(item.position);
                  setEpisodeURL(item.url);
                  item.is_watched = true;
                }}
              >
                {item.is_watched && <i className="small">check</i>}
                {item.name}
              </button>
            );
          })}
      </div>
    </article>
  );
}
