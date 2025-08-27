import { FilterDefault } from "#/api/utils";

export const TabOngoing = {
  id: "ongoing",
  name: "Онгоинги",
  filter: {
    ...FilterDefault,
    sort: 3,
    episodes_from: 1,
    episodes_to: 48,
    status_id: 2,
  },
};

export const TabFinished = {
  id: "finished",
  name: "Завершённые",
  filter: { ...FilterDefault, sort: 3, status_id: 1 },
};

export const TabFilms = {
  id: "films",
  name: "Фильмы",
  filter: { ...FilterDefault, sort: 3, category_id: 2 },
};

export const TabOVA = {
  id: "ova",
  name: "OVA",
  filter: { ...FilterDefault, sort: 3, category_id: 3 },
};

export const tabs = [TabOngoing, TabFinished, TabFilms, TabOVA];
export const tabsId = { ongoing: 0, finished: 1, films: 2, ova: 3 };
