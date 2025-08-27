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

export function minutesToTime(min: number) {
  const seconds = min * 60;
  const epoch = new Date(0);
  const date = new Date(seconds * 1000);

  const diffInMinutes =
    new Date(date.getTime() - epoch.getTime()).getTime() / 1000 / 60;

  let days = Math.floor(diffInMinutes / 1440);
  if (days < 0) days = 0;
  const daysToMinutes = days * 1440;

  let hours = Math.floor((diffInMinutes - daysToMinutes) / 60);
  if (hours < 0) hours = 0;
  const hoursToMinutes = hours * 60;

  let minutes = diffInMinutes - daysToMinutes - hoursToMinutes;
  if (minutes < 0) minutes = 0;

  const dayDisplay =
    days > 0 ? `${days} ${numberDeclension(days, "день", "дня", "дней")}` : "";
  const hourDisplay =
    hours > 0 ?
      `${hours} ${numberDeclension(hours, "час", "часа", "часов")}`
    : "";
  const minuteDisplay =
    minutes > 0 ?
      `${minutes} ${numberDeclension(minutes, "минута", "минуты", "минут")}`
    : "";

  if (days > 0 && hours > 0 && minutes > 0)
    return `${dayDisplay}, ${hourDisplay}, ${minuteDisplay}`;
  if (days > 0 && hours > 0) return `${dayDisplay}, ${hourDisplay}`;
  if (days > 0 && minutes > 0) return `${dayDisplay}, ${minuteDisplay}`;
  if (hours > 0 && minutes > 0) return `${hourDisplay}, ${minuteDisplay}`;
  if (days > 0) return dayDisplay;
  if (hours > 0) return hourDisplay;
  if (minutes > 0) return minuteDisplay;
}

export const FilterCountry = ["Япония", "Китай", "Южная Корея"];
export const FilterCategoryIdToString: Record<number, string> = {
  1: "Сериал",
  2: "Полнометражный фильм",
  3: "OVA",
  4: "Дорама",
};
export const FilterGenre = {
  uncategorized: {
    name: "Нет категории",
    genres: [
      "авангард",
      "гурман",
      "драма",
      "комедия",
      "повседневность",
      "приключения",
      "романтика",
      "сверхъестественное",
      "спорт",
      "тайна",
      "триллер",
      "ужасы",
      "фантастика",
      "фэнтези",
      "экшен",
      "эротика",
      "этти",
    ],
  },
  audience: {
    name: "Аудитория",
    genres: [
      "детское",
      "дзёсей",
      "сэйнэн",
      "сёдзё",
      "сёдзё-ай",
      "сёнен",
      "сёнен-ай",
    ],
  },
  theme: {
    name: "Тематика",
    genres: [
      "CGDCT",
      "антропоморфизм",
      "боевые искусства",
      "вампиры",
      "взрослые персонажи",
      "видеоигры",
      "военное",
      "выживание",
      "гарем",
      "гонки",
      "городское фэнтези",
      "гэг-юмор",
      "детектив",
      "жестокость",
      "забота о детях",
      "злодейка",
      "игра с высокими ставками",
      "идолы (жен.)",
      "идолы (муж.)",
      "изобразительное искусство",
      "исполнительское искусство",
      "исторический",
      "исэкай",
      "иясикэй",
      "командный спорт",
      "космос",
      "кроссдрессинг",
      "культура отаку",
      "любовный многоугольник",
      "магическая смена пола",
      "махо-сёдзё",
      "медицина",
      "меха",
      "мифология",
      "музыка",
      "образовательное",
      "организованная преступность",
      "пародия",
      "питомцы",
      "психологическое",
      "путешествие во времени",
      "работа",
      "реверс-гарем",
      "реинкарнация",
      "романтический подтекст",
      "самураи",
      "спортивные единоборства",
      "стратегические игры",
      "супер сила",
      "удостоено наград",
      "хулиганы",
      "школа",
      "шоу-бизнес",
    ],
  },
};
export const FilterProfileListIdToString: Record<number, string> = {
  0: "Избранное",
  1: "Смотрю",
  2: "В планах",
  3: "Просмотрено",
  4: "Отложено",
  5: "Брошено",
};
export const FilterStudio = [
  "A-1 Pictures",
  "A.C.G.T",
  "ACTAS, Inc",
  "ACiD FiLM",
  "AIC A.S.T.A",
  "AIC PLUS",
  "AIC Spirits",
  "AIC",
  "Animac",
  "ANIMATE",
  "Aniplex",
  "ARMS",
  "Artland",
  "ARTMIC Studios",
  "Asahi Production",
  "Asia-Do",
  "ASHI",
  "Asread",
  "Asmik Ace",
  "Aubeck",
  "BM Entertainment",
  "Bandai Visua",
  "Barnum Studio",
  "Bee Train",
  "BeSTACK",
  "Blender Foundation",
  "Bones",
  "Brains Base",
  "Bridge",
  "Cinema Citrus",
  "Chaos Project",
  "Cherry Lips",
  "David Production",
  "Daume",
  "Doumu",
  "Dax International",
  "DLE INC",
  "Digital Frontier",
  "Digital Works",
  "Diomedea",
  "DIRECTIONS Inc",
  "Dogakobo",
  "Dofus",
  "Encourage Films",
  "Feel",
  "Fifth Avenue",
  "Five Ways",
  "Fuji TV",
  "Foursome",
  "GRAM Studio",
  "G&G Entertainment",
  "Gainax",
  "GANSIS",
  "Gathering",
  "Gonzino",
  "Gonzo",
  "GoHands",
  "Green Bunny",
  "Group TAC",
  "Hal Film Maker",
  "Hasbro Studios",
  "h.m.p",
  "Himajin",
  "Hoods Entertainment",
  "Idea Factory",
  "J.C.Staff",
  "KANSAI",
  "Kaname Production",
  "Kitty Films",
  "Knack",
  "Kokusai Eigasha",
  "KSS (студия)",
  "Kyoto Animation",
  "Lemon Heart",
  "LMD",
  "Madhouse Studios",
  "Magic Bus",
  "Manglobe Inc.",
  "Manpuku Jinja",
  "MAPPA",
  "Milky",
  "Minamimachi Bugyosho",
  "Media Blasters",
  "Mook Animation",
  "Moonrock",
  "MOVIC",
  "Mushi Productions",
  "Natural High",
  "Nippon Animation",
  "Nomad",
  "Lerche",
  "OB Planning",
  "Office AO",
  "Ordet",
  "Oriental Light and Magic",
  "OLM Inc.",
  "P.A. Works",
  "Palm Studio",
  "Pastel",
  "Phoenix Entertainment",
  "Picture Magic",
  "Pink",
  "Pink Pineapple",
  "Planet",
  "Plum",
  "PPM",
  "Primastea",
  "Production I.G",
  "Project No.9",
  "Radix",
  "Rikuentai",
  "Robot",
  "Satelight",
  "Seven",
  "Seven Arcs",
  "Shaft",
  "Silver Link",
  "Shinei Animation",
  "Shogakukan Music & Digital Entertainment",
  "Soft on Demand",
  "Starchild Records",
  "Studio 9 Maiami",
  "Studio Tulip",
  "Studio 4°C",
  "Studio e.go!",
  "Studio A.P.P.P",
  "Studio Barcelona",
  "Studio Blanc",
  "Studio Comet",
  "Studio Deen",
  "Studio Fantasia",
  "Studio Flag",
  "Studio Gallop",
  "Studio Ghibli",
  "Studio Guts",
  "Studio Gokumi",
  "Studio Rikka",
  "Studio Hibari",
  "Studio Junio",
  "Studio Khara",
  "Studio Live",
  "Studio Matrix",
  "Studio Pierrot",
  "Studio Egg",
  "Sunrise",
  "Synergy SP",
  "Synergy Japan",
  "Tatsunoko Production",
  "Tele-Cartoon Japan",
  "Telecom Animation Film",
  "Tezuka Productions",
  "The Answer Studio",
  "TMS",
  "TNK",
  "Toei Animation",
  "Tokyo Kids",
  "TYO Animations",
  "Transarts",
  "Triangle Staff",
  "Trinet Entertainment",
  "Ufotable",
  "Vega Entertainment",
  "Victor Entertainment",
  "Viewworks",
  "White Fox",
  "Wonder Farm",
  "XEBEC-M2",
  "Xebec",
  "Yumeta Company",
  "Zexcs",
  "Zuiyo Eizo",
  "8bit",
];
export const FilterSource = [
  "Оригинал",
  "Манга",
  "Веб-манга",
  "Енкома",
  "Ранобэ",
  "Новелла",
  "Веб-новелла",
  "Визуальная новелла",
  "Игра",
  "Карточная игра",
  "Книга",
  "Книга с картинками",
  "Музыка",
  "Радио",
  "Более одного",
  "Другое",
];
export const FilterYear = Array.from({ length: 200 }, (_, i) => 1900 + i); // 1900-2100 years around now
export const FilterSeasonIdToString = {
  1: "Зима",
  2: "Весна",
  3: "Лето",
  4: "Осень",
};
export const FilterEpisodeCount = [
  {
    name: "Неважно",
    episodes_from: null,
    episodes_to: null,
  },
  {
    name: "От 1 до 12",
    episodes_from: 1,
    episodes_to: 12,
  },
  {
    name: "От 13 до 25",
    episodes_from: 13,
    episodes_to: 25,
  },
  {
    name: "От 26 до 100",
    episodes_from: 26,
    episodes_to: 100,
  },
  {
    name: "Больше 100",
    episodes_from: 100,
    episodes_to: null,
  },
];
export const FilterEpisodeDuration = [
  {
    name: "Неважно",
    episode_duration_from: null,
    episode_duration_to: null,
  },
  {
    name: "До 10 минут",
    episode_duration_from: 1,
    episode_duration_to: 10,
  },
  {
    name: "До 30 минут",
    episode_duration_from: 1,
    episode_duration_to: 30,
  },
  {
    name: "Более 30 минут",
    episode_duration_from: 30,
    episode_duration_to: null,
  },
];
export const FilterStatusIdToString = {
  1: "Вышел",
  2: "Выходит",
  3: "Анонс",
};
export const FilterAgeRatingToString = {
  1: "0+",
  2: "6+",
  3: "12+",
  4: "16+",
  5: "18+",
};
export const FilterSortToString = {
  0: "По дате добавления",
  1: "По рейтингу",
  2: "По годам",
  3: "По популярности",
};

export type Filter = {
  country: null | string;
  category_id: null | number;
  genres: string[];
  is_genres_exclude_mode_enabled: boolean;
  profile_list_exclusions: number[];
  types: number[]; // fetched from /type/all
  studio: null | string;
  source: null | string;
  start_year: null | number;
  end_year: null | number;
  season: null | number;
  episodes_from: null | number;
  episodes_to: null | number;
  episode_duration_from: null | number;
  episode_duration_to: null | number;
  status_id: null | number;
  age_ratings: number[];
  sort: number;
};

export const FilterDefault: Filter = {
  country: null,
  season: null,
  sort: 0,
  source: null,
  studio: null,
  age_ratings: [],
  category_id: null,
  end_year: null,
  episode_duration_from: null,
  episode_duration_to: null,
  episodes_from: null,
  episodes_to: null,
  genres: [],
  is_genres_exclude_mode_enabled: false,
  profile_list_exclusions: [],
  start_year: null,
  status_id: null,
  types: [],
};

export async function FetchFilter(
  {
    country,
    category_id,
    genres,
    is_genres_exclude_mode_enabled,
    profile_list_exclusions,
    types,
    studio,
    source,
    start_year,
    end_year,
    season,
    episodes_from,
    episodes_to,
    episode_duration_from,
    episode_duration_to,
    status_id,
    age_ratings,
    sort,
  }: Filter,
  page: number,
  token: null | string
) {
  let url: string;
  url = `${ENDPOINTS.filter}/${page}`;
  if (token) {
    url += `?token=${token}`;
  }

  const { data, error } = await fetchDataViaPost(
    url,
    JSON.stringify({
      country,
      category_id,
      genres,
      is_genres_exclude_mode_enabled,
      profile_list_exclusions,
      types,
      studio,
      source,
      start_year,
      end_year,
      season,
      episodes_from,
      episodes_to,
      episode_duration_from,
      episode_duration_to,
      status_id,
      age_ratings,
      sort,
    })
  );

  return [data, error];
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
