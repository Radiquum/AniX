"use client";

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
  typesData: any[];
  types: number[];
  setTypes: (types: number[]) => void;
};

export const FiltersTypesModal = ({
  isOpen,
  setIsOpen,
  typesData,
  types,
  setTypes,
}: Props) => {
  const [newTypes, setNewTypes] = useState(types);

  function toggleType(number: number) {
    if (newTypes.includes(number)) {
      setNewTypes(newTypes.filter((list) => list != number));
    } else {
      setNewTypes([...newTypes, number]);
    }
  }

  useEffect(() => {
    setNewTypes(types);
  }, [types]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)} dismissible>
      <ModalHeader>Выберите списки</ModalHeader>
      <ModalBody>
        {typesData.map((item) => {
          return (
            <div
              className="flex items-center gap-2"
              key={`filter-types-${item.name}`}
            >
              <Checkbox
                id={`filter-types-${item.name}`}
                onChange={() => toggleType(Number(item.id))}
                checked={newTypes.includes(Number(item.id))}
                color="blue"
              />
              <Label htmlFor={`filter-types-${item.name}`}>{item.name}</Label>
            </div>
          );
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            setTypes([]);
            setNewTypes([]);
            setIsOpen(false);
          }}
          color="red"
        >
          Сбросить
        </Button>
        <Button
          onClick={() => {
            setTypes(newTypes);
            setNewTypes([]);
            setIsOpen(false);
          }}
          color="blue"
        >
          Применить
        </Button>
        <Button
          onClick={() => {
            if (newTypes.length != typesData.length) {
              setNewTypes(typesData.map((item) => Number(item.id)));
            } else {
              setNewTypes([]);
            }
          }}
          color="light"
        >
          {newTypes.length >= typesData.length ? "Снять все" : "Выбрать все"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
