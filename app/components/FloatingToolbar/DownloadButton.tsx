"use client";

import { ANILIBRIA_API_URL, TORAPI_API_URL } from "#/api/config";
import { formatBytes } from "#/api/utils";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { TabItem, Tabs } from "flowbite-react";
import { Dropdown, DropdownItem } from "flowbite-react";

type Props = {
  release_id: number;
  release_title_ru: string;
  release_title_en: string;
};

export const DownloadButton = ({
  release_id,
  release_title_ru,
  release_title_en,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        className="flex items-center justify-center px-4 py-2 transition-colors first:rounded-l-full last:rounded-r-full hover:bg-gray-300 hover:dark:bg-slate-500"
        onClick={() => setOpenModal(true)}
      >
        <span className="w-6 h-6 sm:w-8 sm:h-8 iconify mdi--download"></span>
      </button>
      <DownloadModal
        release_title_ru={release_title_ru}
        release_title_en={release_title_en}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

const DownloadModal = ({
  release_title_ru,
  release_title_en,
  openModal,
  setOpenModal,
}) => {
  const [releaseTitle, setReleaseTitle] = useState(release_title_ru);

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} dismissible>
      <ModalHeader>Поиск торрентов</ModalHeader>
      <ModalBody>
        <div className="flex items-center gap-2">
          <span>Искать по:</span>
          <Dropdown color={"blue"} size="sm" label={releaseTitle == release_title_ru ? "Русскому названию" : "Оригинальному названию"} dismissOnClick={true}>
            <DropdownItem onClick={() => setReleaseTitle(release_title_ru)}>Русскому названию</DropdownItem>
            <DropdownItem onClick={() => setReleaseTitle(release_title_en)}>Оригинальному названию</DropdownItem>
          </Dropdown>
        </div>
        <Tabs variant="underline">
          <TabItem active title="Anilibria">
            <AnilibriaTorrentTab release_title={releaseTitle} />
          </TabItem>
          <TabItem title="Rutracker">
            <TorApiTorrentTab
              release_title={releaseTitle}
              service="rutracker"
            />
          </TabItem>
          <TabItem title="Rutor">
            <TorApiTorrentTab release_title={releaseTitle} service="rutor" />
          </TabItem>
          <TabItem title="Kinozal">
            <TorApiTorrentTab release_title={releaseTitle} service="kinozal" />
          </TabItem>
          <TabItem title="NoNameClub">
            <TorApiTorrentTab
              release_title={releaseTitle}
              service="nonameclub"
            />
          </TabItem>
        </Tabs>
      </ModalBody>
    </Modal>
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
      <p className="leading-none">{title}</p>
      <p className="my-1 text-xs text-gray-500 dark:text-gray-300">
        {filename}
      </p>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-start gap-2">
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
        <div className="flex items-start gap-2">
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
          errorDesc: "Не удалось найти релиз",
          data: null,
        }));
        return;
      }
      const AL_QueryData = await AL_QueryRes.json();

      if (AL_QueryData.length === 0) {
        setAnilibria((state) => ({
          isLoading: false,
          error: true,
          errorDesc: "Не удалось найти релиз",
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
          errorDesc: "Торренты не нашлись",
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

type TorAPIRequest = {
  type: "title" | "id";
  service: "rutracker" | "rutor" | "kinozal" | "nonameclub";
  query: string;
  category?: number;
  year?: number;
};

const fetchTorAPI = async ({
  type,
  service,
  query,
  category,
  year,
}: TorAPIRequest) => {
  const url = new URL(`${TORAPI_API_URL}/api/search/${type}/${service}`);
  url.searchParams.append("query", query);
  if (category) {
    url.searchParams.append("category", category.toString());
  }
  if (year) {
    url.searchParams.append("year", year.toString());
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    return null;
  }
  return await res.json();
};

const TorApiTorrentTab = ({
  release_title,
  service,
}: {
  release_title: string;
  service: "rutracker" | "rutor" | "kinozal" | "nonameclub";
}) => {
  const [torApi, setTorApi] = useState<any>({
    isLoading: true,
    error: false,
    errorDesc: "",
    data: null,
  });

  useEffect(() => {
    async function _getData() {
      setTorApi((state) => ({
        isLoading: true,
        error: false,
        errorDesc: "",
        data: null,
      }));

      const RutrackerQueryRes = await fetchTorAPI({
        type: "title",
        service,
        query: release_title,
      });

      if (!RutrackerQueryRes || RutrackerQueryRes.Result) {
        setTorApi((state) => ({
          isLoading: false,
          error: true,
          errorDesc: "Торренты не нашлись",
          data: null,
        }));
        return;
      }

      const data = [];
      for (let i = 0; i < RutrackerQueryRes.length; i++) {
        const torrent = await fetchTorAPI({
          type: "id",
          service,
          query: RutrackerQueryRes[i].Id,
        });
        if (torrent && torrent.length > 0) {
          data.push({
            ...RutrackerQueryRes[i],
            ...torrent[0],
          });
        }
      }

      setTorApi((state) => ({
        isLoading: false,
        error: false,
        errorDesc: "",
        data,
      }));
    }
    _getData();
  }, [release_title, service]);

  if (torApi.isLoading) return <p>Загрузка...</p>;
  if (torApi.error) return <p>{torApi.errorDesc}</p>;
  if (torApi.data.length === 0) return <p>Торренты не нашлись</p>;

  return (
    <div className="flex flex-col gap-4">
      {torApi.data.map((item: any) => {
        return (
          <TorrentItem
            key={`torapi-torrent-${item.Hash}`}
            title={item.Name || item.Files[0].Name}
            filename={item.Duration}
            codec={item.Video || null}
            quality={item.Quality || null}
            size={item.Size}
            leechers={item.Peers}
            seeders={item.Seeds}
            magnet={item.Magnet}
            file={item.Torrent}
          />
        );
      })}
    </div>
  );
};
