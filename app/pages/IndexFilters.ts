import { FilterDefault } from "#/api/utils";

export const ListLast = {
  name: "Последнее",
  filter: FilterDefault,
};

export const ListOngoing = {
  name: "Онгоинги",
  filter: { ...FilterDefault, status_id: 2 },
};

export const ListAnnounce = {
  name: "Анонсы",
  filter: { ...FilterDefault, status_id: 3 },
};

export const ListFinished = {
  name: "Завершённые",
  filter: { ...FilterDefault, status_id: 1 },
};

export const ListFilms = {
  name: "Фильмы",
  filter: { ...FilterDefault, category_id: 2 },
};

export const slugToFilter = {
  last: ListLast,
  ongoing: ListOngoing,
  announce: ListAnnounce,
  finished: ListFinished,
  films: ListFilms,
}