"use client";
import { useUserStore } from "./store/auth";
import { usePreferencesStore } from "./store/preferences";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { Spinner } from "./components/Spinner/Spinner";
import { ChangelogModal } from "#/components/ChangelogModal/ChangelogModal";
import { Bounce, ToastContainer } from "react-toastify";
import { NavBarPc } from "./components/Navbar/NavBarPc";
import { NavBarMobile } from "./components/Navbar/NavBarMobile";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";

const inter = Inter({ subsets: ["latin"] });

export const App = (props) => {
  const preferencesStore = usePreferencesStore();
  const userStore = useUserStore((state) => state);
  const [showChangelog, setShowChangelog] = useState(false);
  const [versionResponse, setVersionResponse] = useState({
    version: "",
    version_changelog: "",
    previous_changelogs: [],
  });
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  useEffect(() => {
    async function _checkVersion() {
      const res = await fetch("/api/version");
      const data = await res.json();

      if (data.version !== preferencesStore.params.version) {
        setShowChangelog(true);
        setVersionResponse(data);
      }
    }

    if (preferencesStore._hasHydrated) {
      _checkVersion();
      userStore.checkAuth();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesStore._hasHydrated]);

  if (!preferencesStore._hasHydrated && !userStore._hasHydrated) {
    return (
      <body
        className={`${inter.className} overflow-x-hidden dark:bg-[#0d1117] dark:text-white h-screen flex justify-center items-center`}
      >
        <Spinner />
      </body>
    );
  }

  if (userStore.state === "loading") {
    return (
      <body
        className={`${inter.className} overflow-x-hidden dark:bg-[#0d1117] dark:text-white h-screen flex justify-center items-center`}
      >
        <Spinner />
      </body>
    );
  }

  return (
    <body
      className={`${inter.className} overflow-x-hidden dark:bg-[#0d1117] dark:text-white`}
    >
      <NavBarPc setIsSettingModalOpen={setIsSettingModalOpen} />
      <main className="container px-2 pt-4 pb-24 mx-auto lg:pb-0">
        {props.children}
      </main>
      <ChangelogModal
        isOpen={showChangelog && preferencesStore.flags.showChangelog}
        setIsOpen={() => {
          setShowChangelog(false);
          preferencesStore.setParams({ version: versionResponse.version });
        }}
        versionResponse={versionResponse}
      />
      <Modal
        show={preferencesStore.params.isFirstLaunch}
        onClose={() => preferencesStore.setParams({ isFirstLaunch: false })}
      >
        <ModalHeader>Внимание</ModalHeader>
        <ModalBody>
          <p>
            Данный сайт не связан с разработчиками приложения Anixart, это
            неофициальная имплементация веб клиента для этого приложения.
            <br />
            <br />
            Используя данный веб-сайт вы принимаете что мы не несём
            ответственности за ваш аккаунт.
            <br />
            <br />
            На сайте могут присутствовать ошибки и не доработки, а так-же
            отсутствующий функционал.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color={"blue"}
            onClick={() => preferencesStore.setParams({ isFirstLaunch: false })}
          >
            Принимаю
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer
        className={"mx-2 mb-20 sm:mb-0"}
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="colored"
        transition={Bounce}
      />
      <NavBarMobile setIsSettingModalOpen={setIsSettingModalOpen} />
      <SettingsModal
        isOpen={isSettingModalOpen}
        setIsOpen={setIsSettingModalOpen}
      />
    </body>
  );
};
