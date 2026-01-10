import Link from "next/link";
import { Poster } from "../ReleasePoster/Poster";
import { ReleaseChips } from "../ReleasePoster/Chips";

const profile_lists = {
  // 0: "Не смотрю",
  1: { name: "Смотрю", bg_color: "bg-green-500" },
  2: { name: "В планах", bg_color: "bg-purple-500" },
  3: { name: "Просмотрено", bg_color: "bg-blue-500" },
  4: { name: "Отложено", bg_color: "bg-yellow-500" },
  5: { name: "Брошено", bg_color: "bg-red-500" },
};

export const ReleaseLinkList = (props: {
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
    showOrigTitle?: boolean;
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
    showOrigTitle: true,
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

  return (
    <Link href={`/release/${props.id}`}>
      <div className="flex gap-2">
        <div className="flex-shrink-0 w-32">
          <Poster image={props.image} className="h-auto" />
        </div>
        <div className="flex flex-col gap-1">
          <ReleaseChips
            {...props}
            user_list={user_list}
            grade={grade}
          />
          <div>
            {settings.showGenres &&
              genres.length > 0 &&
              genres.map((genre: string, index: number) => {
                return (
                  <span
                    key={`release_${props.id}_genre_${genre}_${index}`}
                    className="text-sm font-light leading-none dark:text-white"
                  >
                    {index > 0 && ", "}
                    {genre}
                  </span>
                );
              })}
          </div>
          {props.title_ru && (
            <p className="text-lg font-bold line-clamp-2 dark:text-white">
              {props.title_ru}
            </p>
          )}
          {settings.showOrigTitle && props.title_original && (
            <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
              {props.title_original}
            </p>
          )}
          {settings.showDescription && props.description && (
            <p className="mt-2 text-sm font-light leading-none text-white lg:text-base xl:text-lg line-clamp-4">
              {props.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
