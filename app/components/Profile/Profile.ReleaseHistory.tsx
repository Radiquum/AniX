import { Card } from "flowbite-react";

import { ReleaseChips } from "../ReleasePoster/Chips";
import { Poster } from "../ReleasePoster/Poster";
import Link from "next/link";

const profile_lists = {
  // 0: "Не смотрю",
  1: { name: "Смотрю", bg_color: "bg-green-500" },
  2: { name: "В планах", bg_color: "bg-purple-500" },
  3: { name: "Просмотрено", bg_color: "bg-blue-500" },
  4: { name: "Отложено", bg_color: "bg-yellow-500" },
  5: { name: "Брошено", bg_color: "bg-red-500" },
};

export const ProfileReleaseHistory = (props: any) => {
  return (
    <Card className="h-fit">
      <h1 className="text-2xl font-bold">Недавно просмотренные</h1>
      <div className="flex flex-col gap-4">
        {props.history.map((release) => {
          const genres = [];
          const grade = release.grade ? Number(release.grade.toFixed(1)) : null;
          const profile_list_status = release.profile_list_status || null;
          let user_list = null;
          if (profile_list_status != null || profile_list_status != 0) {
            user_list = profile_lists[profile_list_status];
          }
          if (release.genres) {
            const genres_array = release.genres.split(",");
            genres_array.forEach((genre) => {
              genres.push(genre.trim());
            });
          }
          return (
            <Link href={`/release/${release.id}`} key={`history-${release.id}`}>
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-32">
                  <Poster image={release.image} className="h-auto" />
                </div>
                <div className="flex flex-col gap-1">
                  <ReleaseChips
                    {...release}
                    user_list={user_list}
                    grade={grade}
                  />
                  <div>
                    {genres.length > 0 &&
                      genres.map((genre: string, index: number) => {
                        return (
                          <span
                            key={`release_${props.id}_genre_${genre}_${index}`}
                            className="text-sm font-light dark:text-white"
                          >
                            {index > 0 && ", "}
                            {genre}
                          </span>
                        );
                      })}
                  </div>
                  {release.title_ru && (
                    <p className="text-lg font-bold dark:text-white">
                      {release.title_ru}
                    </p>
                  )}
                  {release.title_original && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {release.title_original}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
