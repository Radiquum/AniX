"use client";

import {
  FileInput,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  useThemeMode,
} from "flowbite-react";
import { Spinner } from "../Spinner/Spinner";
import useSWR from "swr";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { b64toBlob, tryCatchAPI, unixToDate, useSWRfetcher } from "#/api/utils";
import { ProfileEditPrivacyModal } from "./Profile.EditPrivacyModal";
import { ProfileEditStatusModal } from "./Profile.EditStatusModal";
import { ProfileEditSocialModal } from "./Profile.EditSocialModal";
import { CropModal } from "../CropModal/CropModal";
import { useSWRConfig } from "swr";
import { useUserStore } from "#/store/auth";
import { ProfileEditLoginModal } from "./Profile.EditLoginModal";
import { toast } from "react-toastify";
import { ProfileBlockedUsersModal } from "./Profile.BlockedUsersModal";

export const ProfileEditModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  profile_id: number;
}) => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [blockedModalOpen, setBlockedModalOpen] = useState(false);
  const [privacyModalSetting, setPrivacyModalSetting] = useState("none");
  const [privacySettings, setPrivacySettings] = useState({
    privacy_stats: 9,
    privacy_counts: 9,
    privacy_social: 9,
    privacy_friend_requests: 9,
  });
  const [socialBounds, setSocialBounds] = useState({
    vk: false,
    google: false,
  });
  const [status, setStatus] = useState("");
  const [login, setLogin] = useState("");
  const { mutate } = useSWRConfig();
  const userStore = useUserStore();
  const theme = useThemeMode();

  const [avatarModalProps, setAvatarModalProps] = useState({
    isOpen: false,
    isActionsDisabled: false,
    selectedImage: null,
    croppedImage: null,
  });

  const privacy_stat_act_social_text = {
    0: "Все пользователи",
    1: "Только друзья",
    2: "Только я",
    9: "Неизвестно",
  };
  const privacy_friend_req_text = {
    0: "Все пользователи",
    1: "Никто",
    9: "Неизвестно",
  };

  function useFetchInfo(url: string) {
    if (!props.token) {
      url = "";
    }

    const { data, isLoading, error } = useSWR(url, useSWRfetcher);
    return [data, isLoading, error];
  }

  const [prefData, prefLoading, prefError] = useFetchInfo(
    `${ENDPOINTS.user.settings.my}?token=${props.token}`
  );
  const [loginData, loginLoading, loginError] = useFetchInfo(
    `${ENDPOINTS.user.settings.login.info}?token=${props.token}`
  );

  const handleAvatarPreview = (e: any) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result;
      setAvatarModalProps({
        ...avatarModalProps,
        isOpen: true,
        selectedImage: content,
      });
      e.target.value = "";
    };
    fileReader.readAsDataURL(file);
  };

  useEffect(() => {
    if (prefData) {
      setPrivacySettings({
        privacy_stats: prefData.privacy_stats,
        privacy_counts: prefData.privacy_counts,
        privacy_social: prefData.privacy_social,
        privacy_friend_requests: prefData.privacy_friend_requests,
      });
      setSocialBounds({
        vk: prefData.is_vk_bound || prefData.isVkBound || false,
        google: prefData.is_google_bound || prefData.isGoogleBound || false,
      });
      setStatus(prefData.status);
    }
  }, [prefData]);

  useEffect(() => {
    if (loginData) {
      setLogin(loginData.login);
    }
  }, [loginData]);

  useEffect(() => {
    async function _uploadAvatar() {
      let block = avatarModalProps.croppedImage.split(";");
      let contentType = block[0].split(":")[1];
      let realData = block[1].split(",")[1];
      const blob = b64toBlob(realData, contentType);

      const formData = new FormData();
      formData.append("image", blob, "cropped.jpg");
      formData.append("name", "image");

      setAvatarModalProps(
        (state) => (state = { ...state, isActionsDisabled: true })
      );

      const tid = toast.loading("Обновление аватара...", {
        position: "bottom-center",
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: theme.mode == "light" ? "light" : "dark",
      });

      const { data, error } = await tryCatchAPI(
        fetch(`${ENDPOINTS.user.settings.avatar}?token=${props.token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: formData,
        })
      );

      if (error) {
        toast.update(tid, {
          render: "Ошибка обновления аватара",
          type: "error",
          autoClose: 2500,
          isLoading: false,
          closeOnClick: true,
          draggable: true,
        });
        setAvatarModalProps(
          (state) => (state = { ...state, isActionsDisabled: false })
        );
        return;
      }

      toast.update(tid, {
        render: "Аватар обновлён",
        type: "success",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setAvatarModalProps(
        (state) =>
          (state = {
            isOpen: false,
            isActionsDisabled: false,
            selectedImage: null,
            croppedImage: null,
          })
      );
      mutate(
        `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
      );
      userStore.checkAuth();
    }

    if (avatarModalProps.croppedImage) {
      _uploadAvatar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarModalProps.croppedImage]);

  if (!prefData || !loginData || prefError || loginError) {
    return <></>;
  }

  return (
    <>
      <Modal
        show={props.isOpen}
        onClose={() => props.setIsOpen(false)}
        size={"7xl"}
      >
        <ModalHeader>Редактирование профиля</ModalHeader>
        <ModalBody>
          {prefLoading ?
            <Spinner />
          : <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 pb-4 border-b-2 border-gray-300 border-solid">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 iconify mdi--user"></span>
                    <p className="text-xl font-bold">Профиль</p>
                  </div>
                </div>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  disabled={prefData.is_change_avatar_banned}
                >
                  <Label htmlFor="dropzone-file" className="cursor-pointer">
                    <FileInput
                      id="dropzone-file"
                      className="hidden"
                      accept="image/jpg, image/jpeg, image/png"
                      onChange={(e) => {
                        handleAvatarPreview(e);
                      }}
                    />
                    <div>
                      <p className="text-lg">Изменить фото профиля</p>
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        {prefData.is_change_avatar_banned ?
                          `Заблокировано до ${unixToDate(
                            prefData.ban_change_avatar_expires,
                            "full"
                          )}`
                        : "Загрузить с устройства"}
                      </p>
                    </div>
                  </Label>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setStatusModalOpen(true);
                  }}
                >
                  <p className="text-lg">Изменить статус</p>
                  <p className="text-base text-gray-500 whitespace-pre dark:text-gray-400">
                    {status}
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  disabled={prefData.is_change_login_banned}
                  onClick={() => {
                    setLoginModalOpen(true);
                  }}
                >
                  <p className="text-lg">Изменить никнейм</p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {prefData.is_change_login_banned ?
                      `Заблокировано до ${unixToDate(
                        prefData.ban_change_login_expires,
                        "full"
                      )}`
                    : login}
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setSocialModalOpen(true);
                  }}
                >
                  <p className="text-lg">Мои социальные сети</p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    укажите ссылки на свои страницы в соц. сетях
                  </p>
                </button>
              </div>
              <div className="flex flex-col gap-2 pb-4 border-b-2 border-gray-300 border-solid">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 iconify mdi--anonymous "></span>
                  <p className="text-xl font-bold">Приватность</p>
                </div>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_stats");
                  }}
                >
                  <p className="text-lg">
                    Кто видит мою статистику, оценки и историю просмотра
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {
                      privacy_stat_act_social_text[
                        privacySettings.privacy_stats
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_counts");
                  }}
                >
                  <p className="text-lg">
                    Кто видит в профиле мои комментарии, коллекции, видео и
                    друзей
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {
                      privacy_stat_act_social_text[
                        privacySettings.privacy_counts
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_social");
                  }}
                >
                  <p className="text-lg">
                    Кто видит в профиле мои социальные сети
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {
                      privacy_stat_act_social_text[
                        privacySettings.privacy_social
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setPrivacyModalOpen(true);
                    setPrivacyModalSetting("privacy_friend_requests");
                  }}
                >
                  <p className="text-lg">
                    Кто может отправлять мне заявки в друзья
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {
                      privacy_friend_req_text[
                        privacySettings.privacy_friend_requests
                      ]
                    }
                  </p>
                </button>
                <button
                  className="p-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => {
                    setBlockedModalOpen(true);
                  }}
                >
                  <p className="text-lg">Блоклист</p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    Список пользователей, которым запрещён доступ к вашей
                    странице
                  </p>
                </button>
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 iconify mdi--link"></span>
                    <p className="text-xl font-bold">Привязка к сервисам</p>
                  </div>
                  <p className="mx-1 text-base text-gray-500 dark:text-gray-400">
                    Недоступно для изменения в данном клиенте
                  </p>
                </div>
                <div className="p-2 mt-2 cursor-not-allowed">
                  <p className="text-lg">Связанные аккаунты</p>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {socialBounds.vk || socialBounds.google ?
                      "Аккаунт привязан к:"
                    : "не привязан к сервисам"}{" "}
                    {socialBounds.vk && "ВК"}
                    {socialBounds.vk && socialBounds.google && ", "}
                    {socialBounds.google && "Google"}
                  </p>
                </div>
              </div>
            </div>
          }
        </ModalBody>
      </Modal>
      {props.token ?
        <>
          <ProfileEditPrivacyModal
            isOpen={privacyModalOpen}
            setIsOpen={setPrivacyModalOpen}
            token={props.token}
            setting={privacyModalSetting}
            privacySettings={privacySettings}
            setPrivacySettings={setPrivacySettings}
          />
          <ProfileEditStatusModal
            isOpen={statusModalOpen}
            setIsOpen={setStatusModalOpen}
            token={props.token}
            status={status}
            setStatus={setStatus}
            profile_id={props.profile_id}
          />
          <ProfileEditSocialModal
            isOpen={socialModalOpen}
            setIsOpen={setSocialModalOpen}
            token={props.token}
            profile_id={props.profile_id}
          />
          <CropModal
            {...avatarModalProps}
            cropParams={{
              aspectRatio: 1 / 1,
              forceAspect: true,
              guides: true,
              width: 600,
              height: 600,
            }}
            setCropModalProps={setAvatarModalProps}
          />
          <ProfileEditLoginModal
            isOpen={loginModalOpen}
            setIsOpen={setLoginModalOpen}
            token={props.token}
            setLogin={setLogin}
            profile_id={props.profile_id}
          />
          <ProfileBlockedUsersModal
            isOpen={blockedModalOpen}
            setIsOpen={setBlockedModalOpen}
            token={props.token}
            profile_id={props.profile_id}
          />
        </>
      : ""}
    </>
  );
};
