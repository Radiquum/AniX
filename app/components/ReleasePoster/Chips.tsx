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

      {!chipSettings.statusHidden && status ?
        <Chip name={status.name} />
      : status_id != 0 && (
          <Chip
            name={
              status_id == 1 ? "Завершено"
              : status_id == 2 ?
                "Онгоинг"
              : status_id == 3 && "Анонс"
            }
          />
        )
      }
      {!chipSettings.episodesHidden && (
        <Chip
          name={episodes_released && episodes_released}
          name_2={episodes_total ? episodes_total + " эп." : "? эп."}
          devider="/"
        />
      )}
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
    </div>
  );
};
