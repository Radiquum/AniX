import { USER_AGENT, ENDPOINTS } from "./config";
export const HEADERS = {
  "User-Agent": USER_AGENT,
  "Content-Type": "application/json; charset=UTF-8",
};

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export async function tryCatchPlayer<T, E = Error>(
  promise: Promise<any>
): Promise<Result<any, any>> {
  try {
    const res: Awaited<Response> = await promise;
    const data = await res.json();
    if (!res.ok) {
      if (data.message) {
        return {
          data: null,
          error: {
            message: data.message,
            code: res.status,
          },
        };
      } else if (data.detail) {
        return {
          data: null,
          error: {
            message: data.detail,
            code: res.status,
          },
        };
      } else {
        return {
          data: null,
          error: {
            message: res.statusText,
            code: res.status,
          },
        };
      }
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export async function tryCatchAPI<T, E = Error>(
  promise: Promise<any>
): Promise<Result<any, any>> {
  try {
    const res: Awaited<Response> = await promise;
    // if (!res.ok) {
    //   return {
    //     data: null,
    //     error: {
    //       message: res.statusText,
    //       code: res.status,
    //     },
    //   };
    // }

    if (
      res.headers.get("content-length") &&
      Number(res.headers.get("content-length")) == 0
    ) {
      return {
        data: null,
        error: {
          message: "Not Found",
          code: 404,
        },
      };
    }

    const data: Awaited<any> = await res.json();
    if (data.code != 0) {
      return {
        data: null,
        error: {
          message: "API Returned an Error",
          code: data.code || 500,
        },
      };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

export const useSWRfetcher = async (url: string) => {
  const { data, error } = await tryCatchAPI(fetch(url));
  if (error) {
    throw error;
  }
  return data;
};

export const fetchDataViaGet = async (
  url: string,
  API_V2: string | boolean = false,
  addHeaders?: Record<string, any>
) => {
  if (API_V2) {
    HEADERS["API-Version"] = "v2";
  }

  const { data, error } = await tryCatchAPI(
    fetch(url, {
      headers: { ...HEADERS, ...addHeaders },
    })
  );

  return { data, error };
};

export const fetchDataViaPost = async (
  url: string,
  body: string,
  API_V2: string | boolean = false,
  addHeaders?: Record<string, any>
) => {
  if (API_V2) {
    HEADERS["API-Version"] = "v2";
  }

  const { data, error } = await tryCatchAPI(
    fetch(url, {
      method: "POST",
      body: body,
      headers: { ...HEADERS, ...addHeaders },
    })
  );

  return { data, error };
};

export function setJWT(user_id: number | string, jwt: string) {
  const data = { jwt: jwt, user_id: user_id };
  localStorage.setItem("JWT", JSON.stringify(data));
}
export function getJWT() {
  const data = localStorage.getItem("JWT");
  return JSON.parse(data);
}
export function removeJWT() {
  localStorage.removeItem("JWT");
}

export function numberDeclension(
  number: number,
  one: string,
  two: string,
  five: string
) {
  if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return five;
  let last_num = number % 10;
  if (last_num == 1) return one;
  if ([2, 3, 4].includes(last_num)) return two;
  if ([5, 6, 7, 8, 9, 0].includes(last_num)) return five;
}

const months = [
  "янв.",
  "фев.",
  "мар.",
  "апр.",
  "мая",
  "июня",
  "июля",
  "авг.",
  "сен.",
  "окт.",
  "ноя.",
  "дек.",
];

export function unixToDate(
  unix: number,
  type: "full" | "dayMonth" | "dayMonthYear"
) {
  const date = new Date(unix * 1000);
  if (type === "full")
    return (
      date.getDate() +
      " " +
      months[date.getMonth()] +
      " " +
      date.getFullYear() +
      ", " +
      `${date.getHours()}`.padStart(2, "0") +
      ":" +
      `${date.getMinutes()}`.padStart(2, "0")
    );
  if (type === "dayMonth")
    return date.getDate() + " " + months[date.getMonth()];
  if (type === "dayMonthYear")
    return (
      date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    );
}

export function sinceUnixDate(unixInSeconds: number) {
  const unix = Math.floor(unixInSeconds * 1000);
  const date = new Date(unix);
  const currentDate = new Date().valueOf();
  const dateDifferenceSeconds = new Date(currentDate - unix).getTime() / 1000;

  const minutes = Math.floor(dateDifferenceSeconds / 60);
  const hours = Math.floor(dateDifferenceSeconds / 3600);
  const days = Math.floor(dateDifferenceSeconds / 86400);

  const minutesName = numberDeclension(minutes, "минута", "минуты", "минут");
  const hoursName = numberDeclension(hours, "час", "часа", "часов");
  const daysName = numberDeclension(days, "день", "дня", "дней");

  if (dateDifferenceSeconds < 60) return "менее минуты назад";
  if (dateDifferenceSeconds < 3600) return `${minutes} ${minutesName} назад`;
  if (dateDifferenceSeconds < 86400) return `${hours} ${hoursName} назад`;
  if (dateDifferenceSeconds < 2592000) return `${days} ${daysName} назад`;

  return (
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
  );
}

export function minutesToTime(
  min: number,
  type?: "full" | "daysOnly" | "daysHours"
) {
  const d = Math.floor(min / 1440); // 60*24
  const h = Math.floor((min - d * 1440) / 60);
  const m = Math.round(min % 60);

  var dDisplay =
    d > 0 ? `${d} ${numberDeclension(d, "день", "дня", "дней")}` : "";
  var hDisplay =
    h > 0 ? `${h} ${numberDeclension(h, "час", "часа", "часов")}` : "";
  var mDisplay =
    m > 0 ? `${m} ${numberDeclension(m, "минута", "минуты", "минут")}` : "";

  if (type == "daysOnly") {
    if (d > 0) return dDisplay;
    return "? дней";
  } else if (type == "daysHours") {
    if (d > 0 && h > 0) return dDisplay + ", " + hDisplay;
    if (h > 0) return hDisplay;
    if (m > 0) return mDisplay;
  } else {
    return `${d > 0 ? dDisplay : ""}${h > 0 ? ", " + hDisplay : ""}${m > 0 ? ", " + mDisplay : ""}`;
  }
}

const StatusList: Record<string, null | number> = {
  last: null,
  finished: 1,
  ongoing: 2,
  announce: 3,
};

export async function _FetchHomePageReleases(
  status: string,
  token: string | null,
  page: string | number = 0
) {
  let statusId: null | number = null;
  let categoryId: null | number = null;
  if (status == "films") {
    categoryId = 2;
  } else {
    statusId = StatusList[status];
  }

  const body = {
    country: null,
    season: null,
    sort: 0,
    studio: null,
    age_ratings: [],
    category_id: categoryId,
    end_year: null,
    episode_duration_from: null,
    episode_duration_to: null,
    episodes_from: null,
    episodes_to: null,
    genres: [],
    profile_list_exclusions: [],
    start_year: null,
    status_id: statusId,
    types: [],
    is_genres_exclude_mode_enabled: false,
  };

  let url: string;
  url = `${ENDPOINTS.filter}/${page}`;
  if (token) {
    url += `?token=${token}`;
  }

  const data: Object = fetch(url, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error fetching data");
      }
    })
    .then((data: Object) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return data;
}

export const BookmarksList = {
  watching: 1,
  planned: 2,
  watched: 3,
  delayed: 4,
  abandoned: 5,
};

export const SortList = {
  adding_descending: 1,
  adding_ascending: 2,
  year_descending: 3,
  year_ascending: 4,
  alphabet_descending: 5,
  alphabet_ascending: 6,
};

export function b64toBlob(
  b64Data: string,
  contentType: string,
  sliceSize?: number
) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
