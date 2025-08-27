"use client";

import {
  Filter,
  FilterCategoryIdToString,
  FilterCountry,
  FilterDefault,
  FilterProfileListIdToString,
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
import { useState } from "react";
import { FiltersGenreModal } from "./FiltersGenreModal";
import { useUserStore } from "#/store/auth";
import { FiltersListExcludeModal } from "./FiltersListExcludeModal";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  filter?: Filter;
};

export const FiltersModal = ({ isOpen, setIsOpen, filter }: ModalProps) => {
  const userStore = useUserStore();

  const [newFilter, setNewFilter] = useState(filter || FilterDefault);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [isListExcludeModalOpen, setIsListExcludeModalOpen] = useState(false);

  function saveGenres(genres, is_genres_exclude_mode_enabled) {
    setNewFilter({ ...newFilter, genres, is_genres_exclude_mode_enabled });
  }

  return (
    <>
      <Modal
        // show={isOpen}
        show={true}
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
            {userStore.isAuth ? <div className="space-y-2">
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
            </div> : ""}
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
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
    </>
  );
};
