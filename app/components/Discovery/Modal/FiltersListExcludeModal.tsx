"use client";

import { FilterProfileListIdToString } from "#/api/utils";
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
  lists: number[];
  setLists: (lists: number[]) => void;
};

export const FiltersListExcludeModal = ({
  isOpen,
  setIsOpen,
  lists,
  setLists,
}: Props) => {
  const [newList, setNewList] = useState(lists);

  function toggleList(number: number) {
    if (newList.includes(number)) {
      setNewList(newList.filter((list) => list != number));
    } else {
      setNewList([...newList, number]);
    }
  }

  useEffect(() => {
    setNewList(lists);
  }, [lists]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)} dismissible>
      <ModalHeader>Выберите списки</ModalHeader>
      <ModalBody>
        {Object.entries(FilterProfileListIdToString).map(([key, value]) => {
          return (
            <div
              className="flex items-center gap-2"
              key={`filter-list-exclude-${value}`}
            >
              <Checkbox
                id={`filter-list-exclude-${value}`}
                onChange={() => toggleList(Number(key))}
                checked={newList.includes(Number(key))}
                color="blue"
              />
              <Label htmlFor={`filter-list-exclude-${value}`}>{value}</Label>
            </div>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            setLists([]);
            setNewList([]);
            setIsOpen(false);
          }}
          color="red"
        >
          Сбросить
        </Button>
        <Button
          onClick={() => {
            setLists(newList);
            setNewList([]);
            setIsOpen(false);
          }}
          color="blue"
        >
          Применить
        </Button>
        <Button
          onClick={() => {
            if (
              newList.length != Object.keys(FilterProfileListIdToString).length
            ) {
              setNewList(
                Object.keys(FilterProfileListIdToString).map((key) =>
                  Number(key)
                )
              );
            } else {
              setNewList([]);
            }
          }}
          color="light"
        >
          {newList.length >= Object.keys(FilterProfileListIdToString).length ?
            "Снять все"
          : "Выбрать все"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
