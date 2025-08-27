"use client";

import { ENDPOINTS } from "#/api/config";
import { FetchFilter, useSWRfetcher } from "#/api/utils";
import { useUserStore } from "#/store/auth";
import useSWR from "swr";

import { tabs, tabsId } from "./PopularFilters";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { ReleaseLink } from "#/components/ReleaseLink/ReleaseLinkUpdate";
import { Spinner } from "#/components/Spinner/Spinner";
type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const PopularModal = ({ isOpen, setIsOpen }: ModalProps) => {
  const token = useUserStore((state) => state.token);
  const [tab, setTab] = useState<
    "ongoing" | "finished" | "films" | "ova" | string
  >("ongoing");
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(null);
    async function _loadReleases() {
      const [data, error] = await FetchFilter(
        tabs[tabsId[tab]].filter,
        0,
        token
      );
      if (!error) {
        setContent(data.content);
      }
    }
    _loadReleases();
  }, [tab, token]);

  return (
    <Modal
      show={isOpen}
      onClose={() => setIsOpen(false)}
      size="7xl"
      dismissible
    >
      <ModalHeader>Популярное</ModalHeader>
      <ModalBody>
        <div className="flex items-center justify-between w-full gap-2">
          <ButtonGroup>
            {tabs.map((item) => (
              <Button
                key={`tabs-popular-${item.name}`}
                color={tab === item.id ? "blue" : "light"}
                onClick={() => setTab(item.id)}
              >
                {item.name}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 lg:grid-cols-3 xl:grid-cols-4">
          {content ?
            content.map((release) => {
              return (
                <div key={release.id} className="w-full h-full">
                  <ReleaseLink {...release} />
                </div>
              );
            })
          : <Spinner />}
        </div>
      </ModalBody>
    </Modal>
  );
};
