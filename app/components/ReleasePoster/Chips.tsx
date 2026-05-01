import { stat } from "fs";
import { Chip } from "../Chip/Chip";

interface ChipProps {
  settings?: any;
  grade?: any;
  status?: any;
  status_id?: any;
  user_list?: any;
  episodes_released?: any;
  episodes_total?: any;
  category?: any;
  is_favorite?: any;
  column?: any;
}

const STATUS_ID_TO_STR = {
  0: null,
  1: "Вышел",
  2: "Выходит",
  3: "Анонс",
};

export const ReleaseChips = ({
  settings,
  grade,
  status,
  status_id,
  user_list,
  episodes_released,
  episodes_total,
  category,
  is_favorite,
  column,
}: ChipProps) => {
  const chipSettings = {
    enabled: true,
    gradeHidden: false,
    statusHidden: false,
    categoryHidden: false,
    episodesHidden: false,
    listHidden: false,
    favHidden: false,
    column: false,
    ...settings,
  };

  const status_name =
    status_id != 0 ? STATUS_ID_TO_STR[status_id] : status ? STATUS_ID_TO_STR[status.id] : null;
  const ep_rel = episodes_released || "?";
  const ep_tot = episodes_total || "?";
  const episode_count = `${ep_rel}${ep_rel == "?" ? "" : "/"}${ep_tot} эп.`;

  return (
    <div
      className={`${chipSettings.enabled ? "flex" : "hidden"} ${chipSettings.column ? "flex-col" : "flex-row"} gap-1 flex-wrap`}
    >
      {!chipSettings.gradeHidden && grade ?
        <Chip
          className={`${chipSettings.column ? "" : "w-12"}`}
          bg_color={
            grade == 0 ? "hidden"
            : grade < 2 ?
              "bg-red-500"
            : grade < 3 ?
              "bg-orange-500"
            : grade < 4 ?
              "bg-yellow-500"
            : "bg-green-500"
          }
          name={`${grade}`}
        />
      : ""}

      {!chipSettings.categoryHidden && category && (
        <Chip name={category.name} />
      )}
      {!chipSettings.listHidden && user_list && (
        <Chip bg_color={user_list.bg_color} name={user_list.name} />
      )}
      {!chipSettings.favHidden && is_favorite && (
        <div className="flex items-center justify-center bg-pink-500 rounded-sm">
          <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--heart"></span>
        </div>
      )}

      {!chipSettings.statusHidden && status && (
        <Chip
          name={status_name}
          name_2={
            status_name == "Вышел" || status_name == "Анонс" ?
              `${ep_tot} эп.`
            : episode_count
          }
        />
      )}
    </div>
  );
};
