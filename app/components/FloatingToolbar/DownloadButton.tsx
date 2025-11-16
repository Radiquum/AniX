"use client";

import { ANILIBRIA_API_URL } from "#/api/config";
import { formatBytes, useSWRfetcher } from "#/api/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useEffect, useState } from "react";

type Props = {
  release_id: number;
  release_title: string;
};

export const DownloadButton = ({ release_id, release_title }: Props) => {
  const [openModal, setOpenModal] = useState(false);
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
          <div>
            <h2 className="text-xl font-bold">Торренты Anilibria</h2>
            <div className="flex flex-col gap-6">
              {anilibria.isLoading ?
                    <p>Загрузка...</p>
                : anilibria.error ?
                    <p>{anilibria.errorDesc}</p>
                : anilibria.data.map((item: any) => {
                    return (
                        <div key={`anilibria-torrent-${item.hash}`} className="">
                            <div className="flex items-center gap-2">
                                <p>{item.release.name.main || item.release.name.english} ({item.description} эп.)</p>
                                <div>
                                    <a className="px-2 py-1 text-white transition-colors rounded bg-neutral-600 hover:bg-neutral-800" href={item.magnet}><span className="w-4 h-4 iconify mdi--magnet"></span></a>
                                    <a className="px-2 py-1 ml-1 text-white transition-colors rounded bg-neutral-600 hover:bg-neutral-800" href={`${ANILIBRIA_API_URL}/api/v1/anime/torrents/${item.hash}/file`}><span className="w-4 h-4 iconify mdi--file"></span></a>
                                </div>
                            </div>
                            <p className="my-2 text-xs text-gray-500 dark:text-gray-300">{item.label}</p>
                            <div className="flex gap-1">
                                <p className="px-2 py-1 text-xs text-white bg-blue-500 rounded-lg">{item.codec.value}</p>
                                <p className="px-2 py-1 text-xs text-white bg-blue-500 rounded-lg">{item.quality.value}</p>
                                <p className="px-2 py-1 text-xs text-white bg-red-500 rounded-lg">{item.leechers} Личей</p>
                                <p className="px-2 py-1 text-xs text-white bg-green-500 rounded-lg">{item.seeders} Сидов</p>
                                <p className="px-2 py-1 text-xs text-white bg-gray-500 rounded-lg">{formatBytes(item.size)}</p>
                            </div>
                        </div>
                    )
                })}
                <hr/>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
