"use client";

import { FilterAgeRatingToString } from "#/api/utils";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  ageRatings: number[];
  setAgeRatings: (lists: number[]) => void;
};

export const FiltersAgeRatingModal = ({
  isOpen,
  setIsOpen,
  ageRatings,
  setAgeRatings,
}: Props) => {
  const [newAgeRatings, setNewAgeRatings] = useState(ageRatings);

  function toggleRating(number: number) {
    if (newAgeRatings.includes(number)) {
      setNewAgeRatings(newAgeRatings.filter((rating) => rating != number));
    } else {
      setNewAgeRatings([...newAgeRatings, number]);
    }
  }

  useEffect(() => {
    setNewAgeRatings(ageRatings);
  }, [ageRatings]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)} dismissible>
      <ModalHeader>Выберите списки</ModalHeader>
      <ModalBody>
        {Object.entries(FilterAgeRatingToString).map(([key, value]) => {
          return (
            <div
              className="flex items-center gap-2"
              key={`filter-age-rating-${value}`}
            >
              <Checkbox
                id={`filter-age-rating-${value}`}
                onChange={() => toggleRating(Number(key))}
                checked={newAgeRatings.includes(Number(key))}
                color="blue"
              />
              <Label htmlFor={`filter-age-rating-${value}`}>{value}</Label>
            </div>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            setAgeRatings([]);
            setNewAgeRatings([]);
            setIsOpen(false);
          }}
          color="red"
        >
          Сбросить
        </Button>
        <Button
          onClick={() => {
            setAgeRatings(newAgeRatings);
            setNewAgeRatings([]);
            setIsOpen(false);
          }}
          color="blue"
        >
          Применить
        </Button>
        <Button
          onClick={() => {
            if (
              newAgeRatings.length !=
              Object.keys(FilterAgeRatingToString).length
            ) {
              setNewAgeRatings(
                Object.keys(FilterAgeRatingToString).map((key) => Number(key))
              );
            } else {
              setNewAgeRatings([]);
            }
          }}
          color="light"
        >
          {newAgeRatings.length >= Object.keys(FilterAgeRatingToString).length ?
            "Снять все"
          : "Выбрать все"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
