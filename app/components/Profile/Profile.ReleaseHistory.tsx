import { Card } from "flowbite-react";

import { ReleaseChips } from "../ReleasePoster/Chips";
import { Poster } from "../ReleasePoster/Poster";
import Link from "next/link";
import { getFixedGrade, getUserList } from "#/api/utils";

export const ProfileReleaseHistory = (props: any) => {
  return (
    <Card className="h-fit">
      <h1 className="text-2xl font-bold">Недавно просмотренные</h1>
      <div className="flex flex-col gap-4">
        {props.history.map((release) => {
          const grade = getFixedGrade(release.grade);
          const profile_list_status = release.profile_list_status || null;
          const user_list = getUserList(profile_list_status);

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
                  <p className="line-clamp-1">{release.genres || ""}</p>
                  {release.title_ru && (
                    <p className="text-lg font-bold dark:text-white line-clamp-2">
                      {release.title_ru}
                    </p>
                  )}
                  {release.title_original && (
                    <p className="hidden text-sm text-gray-600 dark:text-gray-300 md:block">
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
