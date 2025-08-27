"use client";

import { FilterGenre } from "#/api/utils";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  genres: string[];
  exclusionMode: boolean;
  save: (genres, exclusionMode) => void;
};
export const FiltersGenreModal = ({
  isOpen,
  setIsOpen,
  genres,
  exclusionMode,
  save,
}: Props) => {
  const [newGenres, setNewGenres] = useState(genres);
  const [newExclusionMode, setNewExclusionMode] = useState(exclusionMode);

  const genresLength =
    FilterGenre.uncategorized.genres.length +
    FilterGenre.audience.genres.length +
    FilterGenre.theme.genres.length;

  function toggleGenre(string: string) {
    if (newGenres.includes(string)) {
      setNewGenres(newGenres.filter((genre) => genre != string));
    } else {
      setNewGenres([...newGenres, string]);
    }
  }

  useEffect(() => {
    setNewGenres(genres);
    setNewExclusionMode(exclusionMode);
  }, [genres, exclusionMode]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)} dismissible size="6xl">
      <ModalHeader>Жанры</ModalHeader>
      <ModalBody>
        <div>
          {Object.entries(FilterGenre).map(([key, value]) => {
            return (
              <div key={`filter-genre-category-${value.name}`} className="mb-4">
                <p className="mb-2">{value.name}</p>
                {value.genres.map((genre) => {
                  return (
                    <div
                      className="flex items-center gap-2"
                      key={`filter-genre-category-${value.name}-${genre}`}
                    >
                      <Checkbox
                        id={`filter-genre-category-${value.name}-genre-${genre}`}
                        onChange={() => toggleGenre(genre)}
                        checked={newGenres.includes(genre)}
                        color="blue"
                      />
                      <Label
                        htmlFor={`filter-genre-category-${value.name}-genre-${genre}`}
                      >
                        {genre}
                      </Label>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <div>
              <p className="mb-1 font-bold">Режим исключения</p>
              <p className="text-sm text-gray-400 dark:text-gray-300 max-w-52">
                Фильтр будет искать релизы не содержащие ни один из указанных
                выше жанров
              </p>
            </div>
            <ToggleSwitch
              color="blue"
              onChange={() => setNewExclusionMode(!newExclusionMode)}
              checked={newExclusionMode}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                save([], false);
                setNewGenres([]);
                setNewExclusionMode(false);
                setIsOpen(false);
              }}
              color="red"
            >
              Сбросить
            </Button>
            <Button
              onClick={() => {
                save(newGenres, newExclusionMode);
                setNewGenres([]);
                setNewExclusionMode(false);
                setIsOpen(false);
              }}
              color="blue"
            >
              Применить
            </Button>
            <Button
              onClick={() => {
                if (newGenres.length != genresLength) {
                  setNewGenres(Object.entries(FilterGenre).map(([key, value]) => value.genres.map((genre) => genre)).flat());
                } else {
                  setNewGenres([]);
                }
              }}
              color="light"
            >
              {newGenres.length >= genresLength ? "Снять все" : "Выбрать все"}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};
