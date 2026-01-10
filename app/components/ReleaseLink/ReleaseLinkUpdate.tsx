import Link from "next/link";
import { PosterWithStuff } from "../ReleasePoster/PosterWithStuff";

export const ReleaseLink = (props: {
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
}) => {
  return (
    <Link href={`/release/${props.id}`}>
      <PosterWithStuff {...props} />
    </Link>
  );
};
