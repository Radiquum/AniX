import { Poster } from "./Poster";
import { ReleaseChips } from "./Chips";
import { sinceUnixDate } from "#/api/utils";

const profile_lists = {
  // 0: "Не смотрю",
  1: { name: "Смотрю", bg_color: "bg-green-500" },
  2: { name: "В планах", bg_color: "bg-purple-500" },
  3: { name: "Просмотрено", bg_color: "bg-blue-500" },
  4: { name: "Отложено", bg_color: "bg-yellow-500" },
  5: { name: "Брошено", bg_color: "bg-red-500" },
};

export const PosterWithStuff = (props: {
  image: string;
  title_ru: string;
  title_original: string;
  description?: string;
  genres?: string;
  grade?: number;
  id: number;
  settings?: {
    showGenres?: boolean;
    showDescription?: boolean;
  };
  chipsSettings?: {
    enabled: boolean;
    gradeHidden?: boolean;
    statusHidden?: boolean;
    categoryHidden?: boolean;
    episodesHidden?: boolean;
    listHidden?: boolean;
    favHidden?: boolean;
  };
  lastWatchedHidden?: boolean;
  profile_list_status?: number;
  status?: {
    name: string;
  };
  category?: {
    name: string;
  };
  status_id?: number;
  episodes_released?: string;
  episodes_total?: string;
  is_favorite?: boolean;
  last_view_episode?: any;
  last_view_timestamp?: number;
}) => {
  const genres = [];
  const settings = {
    showGenres: true,
    showDescription: true,
    ...props.settings,
  };
  const chipsSettings = props.chipsSettings || {};

  const grade = props.grade ? Number(props.grade.toFixed(1)) : null;
  const profile_list_status = props.profile_list_status || null;
  let user_list = null;
  if (profile_list_status != null || profile_list_status != 0) {
    user_list = profile_lists[profile_list_status];
  }
  if (props.genres) {
    const genres_array = props.genres.split(",");
    genres_array.forEach((genre) => {
      genres.push(genre.trim());
    });
  }

  const showLastWatched =
    (!props.lastWatchedHidden && props.last_view_episode) || false;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg group">
      {showLastWatched ?
        <div className="px-2 pt-2 pb-4 text-xs text-gray-700 bg-gray-100 border border-gray-300 rounded-t-lg dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 iconify mdi--clock-outline"></span>
            <p className="line-clamp-1">
              {props.last_view_timestamp &&
                sinceUnixDate(props.last_view_timestamp)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 iconify mdi--local-movies"></span>
            <p className="line-clamp-1">
              {props.last_view_episode.name ?
                props.last_view_episode.name
              : `${props.last_view_episode.position + 1} серия`}
            </p>
          </div>
        </div>
      : ""}
      <div
        className={`absolute z-20 ${showLastWatched ? "top-14" : "top-2"} left-2 right-2`}
      >
        <ReleaseChips
          {...props}
          user_list={user_list}
          grade={grade}
          settings={chipsSettings}
        ></ReleaseChips>
      </div>
      <div className="absolute z-20 bottom-2 left-2 right-2 lg:translate-y-[100%] group-hover:lg:translate-y-0 transition-transform">
        <div className="lg:-translate-y-[calc(100%_+_1rem)] group-hover:lg:translate-y-0 transition-transform">
          {settings.showGenres &&
            genres.length > 0 &&
            genres.map((genre: string, index: number) => {
              return (
                <span
                  key={`release_${props.id}_genre_${genre}_${index}`}
                  className="hidden font-light leading-none text-white transition-opacity group-hover:opacity-0 sm:inline md:text-sm lg:text-base xl:text-lg"
                >
                  {index > 0 && ", "}
                  {genre}
                </span>
              );
            })}
          {props.title_ru && (
            <p className="text-xl font-bold !leading-none text-white md:text-2xl md:py-0 line-clamp-2">
              {props.title_ru}
            </p>
          )}
          {props.title_original && (
            <p className="hidden mt-1 text-sm leading-none text-gray-300 sm:[display:-webkit-box] md:text-base line-clamp-2">
              {props.title_original}
            </p>
          )}
        </div>
        {settings.showDescription && props.description && (
          <p className="mt-2 text-sm font-light leading-[1.25] text-white lg:text-base xl:text-lg hidden sm:[display:-webkit-box] line-clamp-4">
            {props.description}
          </p>
        )}
      </div>
      <div className="absolute w-full h-full rounded-b-lg bg-gradient-to-t from-black to-transparent"></div>
      <Poster
        image={props.image}
        className={`w-auto h-auto min-w-full min-h-full ${showLastWatched ? "-mt-2" : ""} flex-grow-1`}
      ></Poster>
    </div>
  );
};
