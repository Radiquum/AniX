import Link from "next/link";
import { Poster } from "../ReleasePoster/Poster";
import { ReleaseChips } from "../ReleasePoster/Chips";
import { getFixedGrade, getUserList } from "#/api/utils";

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
  const settings = {
    showGenres: true,
    showDescription: true,
    showOrigTitle: true,
    ...props.settings,
  };

  const grade = getFixedGrade(props.grade);
  const profile_list_status = props.profile_list_status || null;
  const user_list = getUserList(profile_list_status);

  return (
    <Link href={`/release/${props.id}`}>
      <div className="flex gap-2">
        <div className="flex-shrink-0 w-32">
          <Poster image={props.image} className="h-auto" />
        </div>
        <div className="flex flex-col gap-1">
          <ReleaseChips {...props} user_list={user_list} grade={grade} />
          <div>
            {settings.showGenres && (
              <span className="text-sm font-light leading-none dark:text-white">
                {props.genres}
              </span>
            )}
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
