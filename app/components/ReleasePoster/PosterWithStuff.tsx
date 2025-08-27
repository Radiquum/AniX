import { Poster } from "./Poster";
import { ReleaseChips } from "./Chips";

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
    lastWatchedHidden?: boolean;
  };
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
}) => {
  const genres = [];
  const settings = {
    showGenres: true,
    showDescription: true,
    ...props.settings,
  };
  const chipsSettings = props.chipsSettings || {}

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

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg group">
      <div className="absolute z-20 top-2 left-2 right-2">
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
                  className="hidden font-light leading-none text-white sm:inline md:text-sm lg:text-base xl:text-lg"
                >
                  {index > 0 && ", "}
                  {genre}
                </span>
              );
            })}
          {props.title_ru && (
            <p className="text-xl font-bold leading-none text-white md:text-2xl md:py-0 line-clamp-2 lg:line-clamp-3">
              {props.title_ru}
            </p>
          )}
          {props.title_original && (
            <p className="hidden mt-2 text-sm leading-none text-gray-300 sm:[display:-webkit-box] md:text-base line-clamp-2">
              {props.title_original}
            </p>
          )}
        </div>
        {settings.showDescription && props.description && (
          <p className="hidden mt-2 text-sm font-light leading-none text-white sm:block lg:text-base xl:text-lg line-clamp-4">
            {props.description}
          </p>
        )}
      </div>
      <div className="absolute w-full h-full rounded-b-lg bg-gradient-to-t from-black to-transparent"></div>
      <Poster
        image={props.image}
        className="w-auto h-auto min-w-full min-h-full flex-grow-1"
      ></Poster>
    </div>
  );
};
