// хук добавляет ссылки на кастомные источники
// а так-же позволяет добавлять собственные озвучки
// с помощью json (<api-prox>/episode/<id релиза>.json)
// пример находится в файле 841.example.json в папке episode
//
// сами видео файлы эпизодов необходимо хостить отдельно (например с помощью nginx),
// хуку требуется переменная среды HOST_URL, которая ведёт на сервис api-prox

import { logger } from "../shared";
import fs from "fs/promises";

let HOSTNAME: null | string = null;
if (process.env.HOST_URL) {
  HOSTNAME = process.env.HOST_URL;
}

export function match(path: string): boolean {
  // если не установлен хост, не запускаем хук
  if (!HOSTNAME) return false;
  // используем только страницы с путём /episode/*
  const pathRe = /^\/episode\/\d+/;
  if (pathRe.test(path)) return true;
  return false;
}

export interface VoiceoverInfo {
  "@id": number;
  id: number;
  name: string;
  icon: null | string;
  workers: null | string;
  is_sub: boolean;
  episodes_count: number;
  view_count: number;
  pinned: boolean;
}

export interface SourceInfo {
  "@id": number;
  id: number;
  type: number | VoiceoverInfo;
  name: string;
  episodes_count: number;
}

export interface EpisodeInfo {
  "@id": number;
  position: number;
  release: number | any;
  source: number | SourceInfo;
  name: null | string;
  url: string;
  iframe: boolean;
  addedDate: number;
  is_filler: boolean;
  is_watched: boolean;
}

export async function get(data: any, url: URL) {
  const base = "./episode";

  let releaseId = null;
  let voiceOverId = null;
  let sourceId = null;
  let info: any = null;

  const path = url.pathname.split("/").filter((item) => {
    return !["", "episode"].includes(item);
  });

  logger.consoleHook("debug", `Received request for:`, url.pathname);
  logger.consoleHook("debug", `Decoded pathname:`, path);

  releaseId = Number(path[0]);
  voiceOverId = Number(path[1]);
  sourceId = Number(path[2]);
  logger.consoleHook("debug", `Release ID:`, releaseId);
  logger.consoleHook("debug", `Voiceover ID:`, voiceOverId);
  logger.consoleHook("debug", `Source ID:`, sourceId);

  try {
    info = JSON.parse(
      await fs.readFile(`${base}/${releaseId}.json`, {
        encoding: "utf8",
      })
    );
  } catch {
    return data;
  }

  if (path.length == 1) {
    if (!info || !data.hasOwnProperty("types")) {
      return data;
    }

    for (let i = 0; i < info.types.length; i++) {
      const type: VoiceoverInfo = info.types[i];
      const existingType: VoiceoverInfo = data.types.find(
        (item: VoiceoverInfo) => item.id == type.id
      );

      if (existingType) {
        type.name ? (existingType.name = type.name) : null;
        type.icon ? (existingType.icon = type.icon) : null;
        type.workers ? (existingType.workers = type.workers) : "";
        type.is_sub ? (existingType.is_sub = type.is_sub) : null;
        type.episodes_count ?
          (existingType.episodes_count = type.episodes_count)
        : null;
      } else {
        data.types = [
          ...data.types,
          {
            "@id": data.types.length + 1,
            id: type.id,
            name: type.name || "Неизвестная Озвучка",
            icon: type.icon || "",
            workers: type.workers || "",
            is_sub: type.is_sub || false,
            episodes_count: type.episodes_count || 0,
            view_count: 0,
            pinned: false,
          },
        ];
      }
    }
  }

  if (path.length == 2) {
    if (!info || !data.hasOwnProperty("sources")) {
      return data;
    }

    const apiResponse = await fetch(`${HOSTNAME}/episode/${releaseId}`);
    if (!apiResponse.ok) {
      return data;
    }
    const types = await apiResponse.json();
    const type: VoiceoverInfo = types.types.find(
      (item: VoiceoverInfo) => item.id == voiceOverId
    );
    type["@id"] = 2;
    type.episodes_count = 0;
    type.view_count = 0;

    if (data.sources.length > 0) {
      data.sources[0].type = type;
    }

    const sources = info.types.find(
      (item: VoiceoverInfo) => item.id == type.id
    );
    if (!sources || !sources.sources || sources.sources.length == 0) {
      return data;
    }

    for (let i = 0; i < sources.sources.length; i++) {
      const source: SourceInfo = sources.sources[i];
      const existingSource: SourceInfo = data.sources.find(
        (item: SourceInfo) => item.id == source.id
      );

      if (existingSource) {
        source.name ? (existingSource.name = source.name) : null;
        source.episodes_count ?
          (existingSource.episodes_count = source.episodes_count)
        : null;
      } else {
        data.sources = [
          ...data.sources,
          {
            "@id": data.sources.length == 0 ? 1 : 2 + data.sources.length,
            id: source.id,
            type: data.sources.length > 0 ? 2 : type,
            name: source.name || "Неизвестный Источник",
            episodes_count: source.episodes_count || 0,
          },
        ];
      }
    }
  }

  if (path.length == 3) {
    if (!info || !data.hasOwnProperty("episodes")) {
      return data;
    }

    const apiSourceResponse = await fetch(
      `${HOSTNAME}/episode/${releaseId}/${voiceOverId}`
    );
    if (!apiSourceResponse.ok) {
      return data;
    }
    const sources = await apiSourceResponse.json();
    const source = sources.sources.find(
      (item: SourceInfo) => item.id == sourceId
    );

    source["@id"] = 3;
    if (isNaN(source.type["@id"])) {
      source.type = sources.sources[0].type;
    }
    source.type["@id"] = 4;

    const apiReleaseResponse = await fetch(`${HOSTNAME}/release/${releaseId}`);
    if (!apiReleaseResponse.ok) {
      return data;
    }
    const release = await apiReleaseResponse.json();
    release.release["@id"] = 2;
    release.release.screenshots = [];
    release.release.comments = [];
    release.release.screenshot_images = [];
    release.release.related_releases = [];
    release.release.recommended_releases = [];
    release.release.video_banners = [];
    release.release.your_vote = 0;
    release.release.related_count = 0;
    release.release.comment_count = 0;
    release.release.comments_count = 0;
    release.release.collection_count = 0;
    release.release.profile_list_status = 0;

    if (data.episodes.length > 0) {
      data.episodes[0].release = release.release;
      data.episodes[0].source = source;
      data.episodes[0].source.episodes_count = 0;
      data.episodes[0].source.type.workers ?
        null
      : (data.episodes[0].source.type.workers = "");
    }

    const ctypes = info.types;
    if (!ctypes || ctypes.length == 0) return data;
    const ctype = info.types.find(
      (item: VoiceoverInfo) => item.id == voiceOverId
    );
    if (!ctype) return data;
    const csource = ctype.sources.find(
      (item: SourceInfo) => item.id == sourceId
    );
    if (!csource || !csource.episodes) return data;
    const episodes = csource.episodes;
    if (!episodes || episodes.length == 0) return data;

    if (
      data.episodes &&
      data.episodes.length > 0 &&
      data.episodes[0].source &&
      data.episodes[0].source.name == "Sibnet"
    ) {
      data.episodes.forEach((item: EpisodeInfo, index: number) => {
        item.name ? null : (
          (data.episodes[index].name = `${item.position + 1} серия`)
        );
      });
    }

    for (let i = 0; i < episodes.length; i++) {
      const episode: EpisodeInfo = episodes[i];
      const existingEpisode: EpisodeInfo = data.episodes.find(
        (item: EpisodeInfo) => item.position == episode.position
      );

      if (existingEpisode) {
        episode.position ? (existingEpisode.position = episode.position) : null;
        episode.name ? (existingEpisode.name = episode.name) : null;
        episode.url ? (existingEpisode.url = episode.url) : null;
        episode.iframe !== undefined ?
          (existingEpisode.iframe = episode.iframe)
        : null;
        episode.is_filler !== undefined ?
          (existingEpisode.is_filler = episode.is_filler)
        : null;
      } else {
        data.episodes = [
          ...data.episodes,
          {
            "@id": data.episodes.length == 0 ? 1 : 4 + data.episodes.length,
            position: episode.position || data.episodes.length,
            release: data.episodes.length > 0 ? 2 : release.release,
            source: data.episodes.length > 0 ? 3 : source,
            name: episode.name || "Неизвестная Серия",
            url: episode.url || "",
            iframe: episode.iframe !== undefined ? episode.iframe : true,
            addedDate: 0,
            is_filler:
              episode.is_filler !== undefined ? episode.is_filler : false,
            is_watched: false,
          },
        ];
      }
    }
  }

  return data;
}
