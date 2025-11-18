"use client";

import { ANILIBRIA_API_URL } from "#/api/config";
import { formatBytes } from "#/api/utils";
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { TabItem, Tabs } from "flowbite-react";

type Props = {
  release_id: number;
  release_title: string;
};

export const DownloadButton = ({ release_id, release_title }: Props) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        className="flex items-center justify-center px-4 py-2 transition-colors first:rounded-l-full last:rounded-r-full hover:bg-gray-300 hover:dark:bg-slate-500"
        onClick={() => setOpenModal(true)}
      >
        <span className="w-6 h-6 sm:w-8 sm:h-8 iconify mdi--download"></span>
      </button>
      <Modal show={openModal} onClose={() => setOpenModal(false)} dismissible>
        <ModalHeader>Загрузка релиза</ModalHeader>
        <ModalBody>
          <p className="text-xl font-bold">Торренты</p>
          <Tabs variant="underline">
            <TabItem active title="Anilibria">
              <AnilibriaTorrentTab release_title={release_title} />
            </TabItem>
          </Tabs>
        </ModalBody>
      </Modal>
    </>
  );
};

type TorrentItemProps = {
  title: string;
  filename: string;
  magnet: null | string;
  file: null | string;
  // ---
  size: null | string;
  codec: null | string;
  quality: null | string;
  seeders: null | number;
  leechers: null | number;
};

const TorrentItem = ({
  title,
  filename,
  magnet,
  file,
  size,
  seeders,
  leechers,
  codec,
  quality,
}: TorrentItemProps) => {
  return (
    <div>
      <p>{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-300">{filename}</p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {codec != null && (
            <p className="px-2 py-1 text-xs text-white bg-blue-500 rounded-lg">
              {codec}
            </p>
          )}
          {quality != null && (
            <p className="px-2 py-1 text-xs text-white bg-blue-500 rounded-lg">
              {quality}
            </p>
          )}
          {seeders != null && (
            <p className="px-2 py-1 text-xs text-white bg-green-500 rounded-lg">
              {seeders} Сидов
            </p>
          )}
          {leechers != null && (
            <p className="px-2 py-1 text-xs text-white bg-red-500 rounded-lg">
              {leechers} Личей
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {magnet && (
            <a
              className="px-2 py-1 text-white transition-colors bg-green-600 rounded hover:bg-green-800"
              href={magnet}
            >
              <span className="w-4 h-4 iconify mdi--magnet"></span>
            </a>
          )}
          {file && (
            <a
              className="px-2 py-1 text-white transition-colors bg-green-600 rounded hover:bg-green-800"
              href={file}
            >
              <span className="w-4 h-4 iconify mdi--file"></span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AnilibriaTorrentTab = ({ release_title }: { release_title: string }) => {
  const [anilibria, setAnilibria] = useState<any>({
    isLoading: true,
    error: false,
    errorDesc: "",
    data: null,
  });

  useEffect(() => {
    async function _getData() {
      setAnilibria((state) => ({
        isLoading: true,
        error: false,
        errorDesc: "",
        data: null,
      }));

      const AL_QueryRes = await fetch(
        `${ANILIBRIA_API_URL}/api/v1/app/search/releases?query=${release_title}`
      );
      if (!AL_QueryRes.ok) {
        setAnilibria((state) => ({
          isLoading: false,
          error: true,
          errorDesc: "Не удалось найти аниме на Anilibria",
          data: null,
        }));
        return;
      }
      const AL_QueryData = await AL_QueryRes.json();

      if (AL_QueryData.length === 0) {
        setAnilibria((state) => ({
          isLoading: false,
          error: true,
          errorDesc: "Не удалось найти аниме на Anilibria",
          data: null,
        }));
        return;
      }

      const AL_TorrentRes = await fetch(
        `${ANILIBRIA_API_URL}/api/v1/anime/torrents/release/${AL_QueryData[0].id}`
      );
      if (!AL_TorrentRes.ok) {
        setAnilibria((state) => ({
          isLoading: false,
          error: true,
          errorDesc: "Не удалось найти торренты на Anilibria",
          data: null,
        }));
        return;
      }
      const AL_TorrentData = await AL_TorrentRes.json();

      setAnilibria((state) => ({
        isLoading: false,
        error: false,
        errorDesc: "",
        data: AL_TorrentData,
      }));
    }
    _getData();
  }, [release_title]);

  if (anilibria.isLoading) return <p>Загрузка...</p>;
  if (anilibria.error) return <p>{anilibria.errorDesc}</p>;
  if (anilibria.data.length === 0) return <p>Торренты не нашлись</p>;

  return (
    <div className="flex flex-col gap-4">
      {anilibria.data.map((item: any) => {
        return (
          <TorrentItem
            key={`anilibria-torrent-${item.hash}`}
            title={`${item.release.name.main || item.release.name.english} (${item.description} эп.)`}
            magnet={item.magnet}
            file={`${ANILIBRIA_API_URL}/api/v1/anime/torrents/${item.hash}/file`}
            size={formatBytes(item.size)}
            seeders={item.seeders}
            leechers={item.leechers}
            codec={item.codec.value || null}
            quality={item.quality.value || null}
            filename={`${item.filename}`}
          />
        );
      })}
    </div>
  );
};
