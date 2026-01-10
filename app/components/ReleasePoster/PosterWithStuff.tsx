import { Poster } from "./Poster";
import { ReleaseChips } from "./Chips";
import { getFixedGrade, getUserList, sinceUnixDate } from "#/api/utils";

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
  const settings = {
    showGenres: true,
    showDescription: true,
    ...props.settings,
  };
  const chipsSettings = props.chipsSettings || {};

  const grade = getFixedGrade(props.grade);
  const profile_list_status = props.profile_list_status || null;
  const user_list = getUserList(profile_list_status);

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
          {settings.showGenres && (
            <span className="hidden font-light leading-none text-white transition-opacity group-hover:opacity-0 sm:inline md:text-sm lg:text-base xl:text-lg">
              {props.genres}
            </span>
          )}
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
