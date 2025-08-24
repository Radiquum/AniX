import { Card, Table, TableBody, TableCell, TableRow } from "flowbite-react";
import { ReleaseInfoSearchLink } from "#/components/ReleaseInfo/ReleaseInfo.SearchLink";
import { unixToDate, minutesToTime } from "#/api/utils";
const weekDay = [
  "_",
  "каждый понедельник",
  "каждый вторник",
  "каждую среду",
  "каждый четверг",
  "каждую пятницу",
  "каждую субботу",
  "каждое воскресенье",
];
const YearSeason = ["_", "Зима", "Весна", "Лето", "Осень"];
export const ReleaseInfoInfo = (props: {
  country: string | null;
  aired_on_date: number | null;
  year: number | null;
  episodes: { total: number | null; released: number | null };
  season: number;
  status: string;
  duration: number;
  category: string;
  broadcast: number;
  studio: string | null;
  author: string | null;
  director: string | null;
  genres: string;
}) => {
  return (
    <Card>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="py-0">
              {props.country ?
                props.country.toLowerCase() == "япония" ?
                  <span className="w-8 h-8 iconify-color twemoji--flag-for-japan"></span>
                : <span className="w-8 h-8 iconify-color twemoji--flag-for-china"></span>

              : <span className="w-8 h-8 iconify-color twemoji--flag-for-united-nations "></span>
              }
            </TableCell>
            <TableCell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {props.country && props.country}
              {(props.aired_on_date != 0 || props.year) && ", "}
              {props.season && props.season != 0 ?
                `${YearSeason[props.season]} `
              : ""}
              {props.year && `${props.year} г.`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-0">
              <span className="w-8 h-8 iconify-color mdi--animation-play-outline dark:invert"></span>
            </TableCell>
            <TableCell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {props.episodes.released ? props.episodes.released : "?"}
              {"/"}
              {props.episodes.total ? props.episodes.total + " эп. " : "? эп. "}
              {props.duration != 0 &&
                `по ${minutesToTime(props.duration)}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-0">
              <span className="w-8 h-8 iconify-color mdi--calendar-outline dark:invert"></span>
            </TableCell>
            <TableCell className="font-medium text-gray-900 dark:text-white">
              {props.category}
              {", "}
              {props.broadcast == 0 ?
                props.status.toLowerCase()
              : `выходит ${weekDay[props.broadcast]}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-0">
              <span className="w-8 h-8 iconify-color mdi--people-group-outline dark:invert"></span>
            </TableCell>
            <TableCell className="font-medium text-gray-900 dark:text-white">
              {props.studio && (
                <>
                  {"Студия: "}
                  {props.studio
                    .split(", ")
                    .map((studio: string, index: number) => {
                      return (
                        <div key={index} className="inline">
                          {index > 0 && ", "}
                          <ReleaseInfoSearchLink
                            title={studio}
                            searchBy={"studio"}
                          />
                        </div>
                      );
                    })}
                  {(props.author || props.director) && ", "}
                </>
              )}
              {props.author && (
                <>
                  {"Автор: "}
                  <ReleaseInfoSearchLink
                    title={props.author}
                    searchBy={"author"}
                  />
                  {props.director && ", "}
                </>
              )}
              {props.director && (
                <>
                  {"Режиссёр: "}
                  <ReleaseInfoSearchLink
                    title={props.director}
                    searchBy={"director"}
                  />
                </>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="py-0">
              <span className="w-8 h-8 iconify-color mdi--tag-outline dark:invert"></span>
            </TableCell>
            <TableCell className="font-medium text-gray-900 dark:text-white">
              {props.genres &&
                props.genres.split(", ").map((genre: string, index: number) => {
                  return (
                    <div key={index} className="inline">
                      {index > 0 && ", "}
                      <ReleaseInfoSearchLink title={genre} searchBy={"tag"} />
                    </div>
                  );
                })}
            </TableCell>
          </TableRow>
          {props.status.toLowerCase() == "анонс" && (
            <TableRow>
              <TableCell className="py-0">
                <span className="w-8 h-8 iconify-color mdi--clock-outline dark:invert"></span>
              </TableCell>
              <TableCell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.aired_on_date != 0 ?
                  unixToDate(props.aired_on_date, "full")
                : props.year ?
                  <>
                    {props.season && props.season != 0 ?
                      `${YearSeason[props.season]} `
                    : ""}
                    {props.year && `${props.year} г.`}
                  </>
                : "Скоро"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
