import { tryCatchPlayer, tryCatchAPI } from "#/api/utils";
import { env } from "next-runtime-env";

export async function _fetchAPI(
  url: string,
  onErrorMsg: string,
  setPlayerError: (state) => void,
  onErrorCodes?: Record<number, string>
) {
  const { data, error } = await tryCatchAPI(fetch(url));
  if (error) {
    let errorDetail = "Мы правда не знаем что произошло...";

    if (error.name) {
      if (error.name == "TypeError") {
        errorDetail = "Не удалось подключиться к серверу";
      } else {
        errorDetail = `Неизвестная ошибка ${error.name}: ${error.message}`;
      }
    }
    if (error.code) {
      if (Object.keys(onErrorCodes).includes(error.code.toString())) {
        errorDetail = onErrorCodes[error.code.toString()];
      } else {
        errorDetail = `API вернуло ошибку: ${error.code}`;
      }
    }

    setPlayerError({
      message: onErrorMsg,
      detail: errorDetail,
    });
    return null;
  }
  return data;
}

export async function _fetchPlayer(
  url: string,
  setPlayerError: (state) => void
) {
  const { data, error } = (await tryCatchPlayer(fetch(url))) as any;
  if (error) {
    let errorDetail = "Мы правда не знаем что произошло...";

    if (error.name) {
      if (error.name == "TypeError") {
        errorDetail = "Не удалось подключиться к серверу";
      } else {
        errorDetail = `Неизвестная ошибка ${error.name}: ${error.message}`;
      }
    } else if (error.message) {
      errorDetail = error.message;
    }

    setPlayerError({
      message: "Не удалось получить ссылку на видео",
      detail: errorDetail,
    });
    return null;
  }
  return data;
}

export const _fetchKodikManifest = async (
  url: string,
  setPlayerError: (state) => void
) => {
  const NEXT_PUBLIC_PLAYER_PARSER_URL = env("NEXT_PUBLIC_PLAYER_PARSER_URL");
  if (!NEXT_PUBLIC_PLAYER_PARSER_URL) {
    setPlayerError({
      message: "Плеер не настроен",
      detail: "переменная 'NEXT_PUBLIC_PLAYER_PARSER_URL' не обнаружена",
    });
    return { manifest: null, poster: null };
  }

  const data = await _fetchPlayer(
    `${NEXT_PUBLIC_PLAYER_PARSER_URL}/?url=${url}&player=kodik`,
    setPlayerError
  );

  if (data) {
    let manifest: string = data.manifest;
    if (!manifest.startsWith("http")) {
      let file = new File([manifest], "manifest.m3u8", {
        type: "application/x-mpegURL",
      });
      manifest = URL.createObjectURL(file);
    }
    return { manifest, poster: data.poster };
  }
  return { manifest: null, poster: null };
};

export const _fetchAnilibriaManifest = async (
  url: string,
  setPlayerError: (state) => void
) => {
  const NEXT_PUBLIC_PLAYER_PARSER_URL = env("NEXT_PUBLIC_PLAYER_PARSER_URL");
  if (!NEXT_PUBLIC_PLAYER_PARSER_URL) {
    setPlayerError({
      message: "Плеер не настроен",
      detail: "переменная 'NEXT_PUBLIC_PLAYER_PARSER_URL' не обнаружена",
    });
    return { manifest: null, poster: null };
  }

  const data = await _fetchPlayer(
    `${NEXT_PUBLIC_PLAYER_PARSER_URL}/?url=${encodeURIComponent(url)}&player=libria`,
    setPlayerError
  );

  if (data) {
    let file = new File([data.manifest], "manifest.m3u8", {
      type: "application/x-mpegURL",
    });
    let manifest = URL.createObjectURL(file);
    return { manifest, poster: data.poster };
  }
  return { manifest: null, poster: null };
};

export const _fetchSibnetManifest = async (
  url: string,
  setPlayerError: (state) => void
) => {
  const NEXT_PUBLIC_PLAYER_PARSER_URL = env("NEXT_PUBLIC_PLAYER_PARSER_URL");
  if (!NEXT_PUBLIC_PLAYER_PARSER_URL) {
    setPlayerError({
      message: "Плеер не настроен",
      detail: "переменная 'NEXT_PUBLIC_PLAYER_PARSER_URL' не обнаружена",
    });
    return { manifest: null, poster: null };
  }

  const data = await _fetchPlayer(
    `${NEXT_PUBLIC_PLAYER_PARSER_URL}/?url=${url}&player=sibnet`,
    setPlayerError
  );

  if (data) {
    return { manifest: data.manifest, poster: data.poster };
  }
  return { manifest: null, poster: null };
};
