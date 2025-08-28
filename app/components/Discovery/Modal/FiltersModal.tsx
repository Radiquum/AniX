"use client";

import {
  Filter,
  FilterAgeRatingToString,
  FilterCategoryIdToString,
  FilterCountry,
  FilterDefault,
  FilterEpisodeCount,
  FilterEpisodeDuration,
  FilterProfileListIdToString,
  FilterSeasonIdToString,
  FilterSortToString,
  FilterSource,
  FilterStatusIdToString,
  FilterStudio,
  FilterYear,
  tryCatchAPI,
} from "#/api/utils";
import {
  Button,
  Dropdown,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FiltersGenreModal } from "./FiltersGenreModal";
import { useUserStore } from "#/store/auth";
import { FiltersListExcludeModal } from "./FiltersListExcludeModal";
import { ENDPOINTS } from "#/api/config";
import { FiltersTypesModal } from "./FiltersTypesModal";
import { FiltersAgeRatingModal } from "./FiltersAgeRatingModal";
import { useRouter } from "next/navigation";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  filter?: Filter;
  setFilter?: (filter: Filter) => void;
};

export const FiltersModal = ({
  isOpen,
  setIsOpen,
  filter,
  setFilter,
}: ModalProps) => {
  const userStore = useUserStore();
  const router = useRouter();

  const [newFilter, setNewFilter] = useState(filter || FilterDefault);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isListExcludeModalOpen, setIsListExcludeModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isAgeRatingModalOpen, setIsAgeRatingModalOpen] = useState(false);

  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      const { data, error } = await tryCatchAPI(fetch(ENDPOINTS.filterTypes));

      if (error) {
        setError(error);
      } else {
        setTypes(data.types);
      }
    };
    fetchData();
  }, []);

  function saveGenres(genres, is_genres_exclude_mode_enabled) {
    setNewFilter({ ...newFilter, genres, is_genres_exclude_mode_enabled });
  }

  function saveFilter() {
    const _filter = JSON.stringify(newFilter);
    if (setFilter) {
      setFilter(newFilter);
    } else {
      router.push(`/discovery/filter?filter=${_filter}`);
    }
    setIsOpen(false);
  }

  return (
    <>
      <Modal
        show={isOpen}
        onClose={() => setIsOpen(false)}
        size="4xl"
        dismissible
      >
        <ModalHeader>Фильтр</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <p>Страна</p>
              <Dropdown
                label={newFilter.country || "Неважно"}
                color="blue"
                className="w-full"
              >
                <DropdownItem
                  key={`filter-modal-country-none`}
                  onClick={() => setNewFilter({ ...newFilter, country: null })}
                >
                  Неважно
                </DropdownItem>
                {FilterCountry.map((item) => {
                  return (
                    <DropdownItem
                      key={`filter-modal-country-${item}`}
                      onClick={() =>
                        setNewFilter({ ...newFilter, country: item })
                      }
                    >
                      {item}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
            <div className="space-y-2">
              <p>Категория</p>
              <Dropdown
                label={
                  newFilter.category_id ?
                    FilterCategoryIdToString[newFilter.category_id]
                  : "Неважно"
                }
                color="blue"
                className="w-full"
              >
                <DropdownItem
                  key={`filter-modal-category-none`}
                  onClick={() =>
                    setNewFilter({ ...newFilter, category_id: null })
                  }
                >
                  Неважно
                </DropdownItem>
                {Object.entries(FilterCategoryIdToString).map(
                  ([key, value]) => {
                    return (
                      <DropdownItem
                        key={`filter-modal-category-${key}`}
                        onClick={() =>
                          setNewFilter({
                            ...newFilter,
                            category_id: Number(key),
                          })
                        }
                      >
                        {value}
                      </DropdownItem>
                    );
                  }
                )}
              </Dropdown>
            </div>
            <div className="space-y-2">
              <p>Жанры</p>
              <Button
                color={"blue"}
                className="w-full min-h-10 h-fit"
                onClick={() => setIsGenreModalOpen(true)}
              >
                {newFilter.genres.length > 0 ?
                  newFilter.genres.join(", ")
                : "Неважно"}
              </Button>
              <p className="text-sm">
                Будет искать релизы, содержащие каждый из указанных жанров.
                Рекомендуется выбирать не более 3 жанров
              </p>
            </div>
            {userStore.isAuth ?
              <div className="space-y-2">
                <p>Исключить закладки</p>
                <Button
                  color={"blue"}
                  className="w-full min-h-10 h-fit"
                  onClick={() => setIsListExcludeModalOpen(true)}
                >
                  {newFilter.profile_list_exclusions.length > 0 ?
                    newFilter.profile_list_exclusions
                      .map((id) => FilterProfileListIdToString[id])
                      .join(", ")
                  : "Неважно"}
                </Button>
                <p className="text-sm">
                  Исключит из выдачи релизы, входящие в указанные закладки
                </p>
              </div>
            : ""}
            <div className="space-y-2">
              <p>Варианты озвучек</p>
              <Button
                color={"blue"}
                className="w-full min-h-10 h-fit"
                onClick={() => setIsTypeModalOpen(true)}
              >
                {error ?
                  error.message
                : newFilter.types.length > 0 ?
                  newFilter.types
                    .map((type) => types.find((t) => t.id === type).name)
                    .join(", ")
                : "Неважно"}
              </Button>
            </div>
            <div className="space-y-2">
              <p>Студия</p>
              <Dropdown
                label={newFilter.studio ? newFilter.studio : "Неважно"}
                color="blue"
                className="w-full overflow-y-auto max-h-64"
              >
                <DropdownItem
                  key={`filter-modal-studio-none`}
                  onClick={() => setNewFilter({ ...newFilter, studio: null })}
                >
                  Неважно
                </DropdownItem>
                {FilterStudio.map((value) => {
                  return (
                    <DropdownItem
                      key={`filter-modal-studio-${value}`}
                      onClick={() =>
                        setNewFilter({
                          ...newFilter,
                          studio: value,
                        })
                      }
                    >
                      {value}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
            <div className="space-y-2">
              <p>Первоисточник</p>
              <Dropdown
                label={newFilter.source ? newFilter.source : "Неважно"}
                color="blue"
                className="w-full overflow-y-auto max-h-64"
              >
                <DropdownItem
                  key={`filter-modal-source-none`}
                  onClick={() => setNewFilter({ ...newFilter, source: null })}
                >
                  Неважно
                </DropdownItem>
                {FilterSource.map((value) => {
                  return (
                    <DropdownItem
                      key={`filter-modal-source-${value}`}
                      onClick={() =>
                        setNewFilter({
                          ...newFilter,
                          source: value,
                        })
                      }
                    >
                      {value}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
            <div className="space-y-2">
              <p>Года</p>
              <div className="flex items-center gap-2">
                <p>С</p>
                <Dropdown
                  label={
                    newFilter.start_year ? newFilter.start_year : "Неважно"
                  }
                  color="blue"
                  className="mr-2 overflow-y-auto max-h-64"
                >
                  <DropdownItem
                    key={`filter-modal-year-start-none`}
                    onClick={() =>
                      setNewFilter({ ...newFilter, start_year: null })
                    }
                  >
                    Неважно
                  </DropdownItem>
                  {FilterYear.map((value) => {
                    return (
                      <DropdownItem
                        key={`filter-modal-year-start-${value}`}
                        onClick={() =>
                          setNewFilter({
                            ...newFilter,
                            start_year: value,
                          })
                        }
                      >
                        {value}
                      </DropdownItem>
                    );
                  })}
                </Dropdown>
                <p>По</p>
                <Dropdown
                  label={newFilter.end_year ? newFilter.end_year : "Неважно"}
                  color="blue"
                  className="mr-2 overflow-y-auto max-h-64"
                >
                  <DropdownItem
                    key={`filter-modal-year-end-none`}
                    onClick={() =>
                      setNewFilter({ ...newFilter, end_year: null })
                    }
                  >
                    Неважно
                  </DropdownItem>
                  {FilterYear.map((value) => {
                    return (
                      <DropdownItem
                        key={`filter-modal-year-end-${value}`}
                        onClick={() =>
                          setNewFilter({
                            ...newFilter,
                            end_year: value,
                          })
                        }
                      >
                        {value}
                      </DropdownItem>
                    );
                  })}
                </Dropdown>
                <p>Сезон</p>
                <Dropdown
                  label={
                    newFilter.season ?
                      FilterSeasonIdToString[newFilter.season]
                    : "Неважно"
                  }
                  color="blue"
                  className="mr-2 overflow-y-auto max-h-64"
                >
                  <DropdownItem
                    key={`filter-modal-year-end-none`}
                    onClick={() => setNewFilter({ ...newFilter, season: null })}
                  >
                    Неважно
                  </DropdownItem>
                  {Object.entries(FilterSeasonIdToString).map(
                    ([key, value]) => {
                      return (
                        <DropdownItem
                          key={`filter-modal-season-${value}`}
                          onClick={() =>
                            setNewFilter({
                              ...newFilter,
                              season: Number(key),
                            })
                          }
                        >
                          {value}
                        </DropdownItem>
                      );
                    }
                  )}
                </Dropdown>
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p>Эпизодов</p>
                  <Dropdown
                    label={
                      FilterEpisodeCount.find(
                        (episode) =>
                          episode.episodes_from === newFilter.episodes_from &&
                          episode.episodes_to === newFilter.episodes_to
                      ).name
                    }
                    color="blue"
                    className="w-full overflow-y-auto max-h-64"
                  >
                    {FilterEpisodeCount.map((value) => {
                      return (
                        <DropdownItem
                          key={`filter-modal-episode-count-${value.name}`}
                          onClick={() =>
                            setNewFilter({
                              ...newFilter,
                              episodes_from: value.episodes_from,
                              episodes_to: value.episodes_to,
                            })
                          }
                        >
                          {value.name}
                        </DropdownItem>
                      );
                    })}
                  </Dropdown>
                </div>
                <div className="space-y-2">
                  <p>Длительность эпизода</p>
                  <Dropdown
                    label={
                      FilterEpisodeDuration.find(
                        (episode) =>
                          episode.episode_duration_from ===
                            newFilter.episode_duration_from &&
                          episode.episode_duration_to ===
                            newFilter.episode_duration_to
                      ).name
                    }
                    color="blue"
                    className="w-full overflow-y-auto max-h-64"
                  >
                    {FilterEpisodeDuration.map((value) => {
                      return (
                        <DropdownItem
                          key={`filter-modal-episode-duration-${value.name}`}
                          onClick={() =>
                            setNewFilter({
                              ...newFilter,
                              episode_duration_from:
                                value.episode_duration_from,
                              episode_duration_to: value.episode_duration_to,
                            })
                          }
                        >
                          {value.name}
                        </DropdownItem>
                      );
                    })}
                  </Dropdown>
                </div>
                <div className="space-y-2">
                  <p>Статус</p>
                  <Dropdown
                    label={
                      newFilter.status_id ?
                        FilterStatusIdToString[newFilter.status_id]
                      : "Неважно"
                    }
                    color="blue"
                    className="w-full overflow-y-auto max-h-64"
                  >
                    <DropdownItem
                      key={`filter-modal-status-none`}
                      onClick={() =>
                        setNewFilter({ ...newFilter, status_id: null })
                      }
                    >
                      Неважно
                    </DropdownItem>
                    {Object.entries(FilterStatusIdToString).map(
                      ([key, value]) => {
                        return (
                          <DropdownItem
                            key={`filter-modal-status-${value}`}
                            onClick={() =>
                              setNewFilter({
                                ...newFilter,
                                status_id: Number(key),
                              })
                            }
                          >
                            {value}
                          </DropdownItem>
                        );
                      }
                    )}
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p>Возрастное ограничение</p>
              <Button
                color={"blue"}
                className="w-full min-h-10 h-fit"
                onClick={() => setIsAgeRatingModalOpen(true)}
              >
                {newFilter.age_ratings.length > 0 ?
                  newFilter.age_ratings
                    .map((age_rating) => FilterAgeRatingToString[age_rating])
                    .join(", ")
                : "Неважно"}
              </Button>
            </div>
            <div className="space-y-2">
              <p>Сортировка</p>
              <Dropdown
                label={FilterSortToString[newFilter.sort]}
                color="blue"
                className="w-full overflow-y-auto max-h-64"
              >
                {Object.entries(FilterSortToString).map(([key, value]) => {
                  return (
                    <DropdownItem
                      key={`filter-modal-sort-${value}`}
                      onClick={() =>
                        setNewFilter({
                          ...newFilter,
                          sort: Number(key),
                        })
                      }
                    >
                      {value}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" onClick={saveFilter}>
            Применить
          </Button>
        </ModalFooter>
      </Modal>
      <FiltersGenreModal
        isOpen={isGenreModalOpen}
        setIsOpen={setIsGenreModalOpen}
        genres={newFilter.genres}
        exclusionMode={newFilter.is_genres_exclude_mode_enabled}
        save={saveGenres}
      />
      <FiltersListExcludeModal
        isOpen={isListExcludeModalOpen}
        setIsOpen={setIsListExcludeModalOpen}
        lists={newFilter.profile_list_exclusions}
        setLists={(profile_list_exclusions) =>
          setNewFilter({ ...newFilter, profile_list_exclusions })
        }
      />
      <FiltersTypesModal
        isOpen={isTypeModalOpen}
        setIsOpen={setIsTypeModalOpen}
        typesData={types}
        types={newFilter.types}
        setTypes={(types) => setNewFilter({ ...newFilter, types })}
      />
      <FiltersAgeRatingModal
        isOpen={isAgeRatingModalOpen}
        setIsOpen={setIsAgeRatingModalOpen}
        ageRatings={newFilter.age_ratings}
        setAgeRatings={(age_ratings) =>
          setNewFilter({ ...newFilter, age_ratings })
        }
      />
    </>
  );
};
