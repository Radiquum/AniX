"use client";

import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import useSWR from "swr";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Spinner } from "#/components/Spinner/Spinner";
import { ReleaseCourusel } from "#/components/ReleaseCourusel/ReleaseCourusel";
type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const ScheduleModal = ({ isOpen, setIsOpen }: ModalProps) => {
  const { data, isLoading, error } = useSWR(
    ENDPOINTS.discover.schedule,
    useSWRfetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <Modal
      show={isOpen}
      onClose={() => setIsOpen(false)}
      size="7xl"
      dismissible
    >
      <ModalHeader>Расписание</ModalHeader>
      <ModalBody>
        {!error ?
          isLoading ?
            <div className="flex items-center justify-center w-full h-64">
              <Spinner />
            </div>
          : <div className="flex flex-col gap-4">
              <ReleaseCourusel
                content={data.monday}
                sectionTitle={"Понедельник"}
              />
              <ReleaseCourusel
                content={data.tuesday}
                sectionTitle={"Вторник"}
              />
              <ReleaseCourusel
                content={data.wednesday}
                sectionTitle={"Среда"}
              />
              <ReleaseCourusel
                content={data.thursday}
                sectionTitle={"Четверг"}
              />
              <ReleaseCourusel content={data.friday} sectionTitle={"Пятница"} />
              <ReleaseCourusel
                content={data.saturday}
                sectionTitle={"Суббота"}
              />
              <ReleaseCourusel
                content={data.sunday}
                sectionTitle={"Воскресенье"}
              />
            </div>

        : "Ошибка загрузки"}
      </ModalBody>
    </Modal>
  );
};
