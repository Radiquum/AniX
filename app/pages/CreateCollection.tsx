"use client";
import useSWRInfinite from "swr/infinite";
import { useUserStore } from "#/store/auth";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ENDPOINTS } from "#/api/config";
import {
  Button,
  Card,
  Checkbox,
  FileInput,
  Label,
  Modal,
  ModalHeader,
  Textarea,
  TextInput,
  useThemeMode,
} from "flowbite-react";
import { PosterWithStuff } from "#/components/ReleasePoster/PosterWithStuff";
import { CropModal } from "#/components/CropModal/CropModal";
import { b64toBlob, tryCatchAPI } from "#/api/utils";

import { useSWRfetcher } from "#/api/utils";
import { Spinner } from "#/components/Spinner/Spinner";
import { toast } from "react-toastify";

export const CreateCollectionPage = () => {
  const userStore = useUserStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useThemeMode();

  useEffect(() => {
    if (userStore.state === "finished" && !userStore.token) {
      router.push("/login?redirect=/collections/create");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore]);

  const [edit, setEdit] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState({
    title: "",
    description: "",
  });
  const [stringLength, setStringLength] = useState({
    title: 0,
    description: 0,
  });
  const [addedReleases, setAddedReleases] = useState([]);
  const [addedReleasesIds, setAddedReleasesIds] = useState([]);
  const [releasesEditModalOpen, setReleasesEditModalOpen] = useState(false);

  const [imageModalProps, setImageModalProps] = useState({
    isOpen: false,
    isActionsDisabled: false,
    selectedImage: null,
    croppedImage: null,
  });
  const [imageUrl, setImageUrl] = useState<string>(null);

  const collection_id = searchParams.get("id") || null;
  const mode = searchParams.get("mode") || null;

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function _checkMode() {
      if (mode === "edit" && collection_id) {
        setIsSending(true);
        const res = await fetch(
          `${ENDPOINTS.collection.base}/${collection_id}?token=${userStore.token}`
        );
        const data = await res.json();

        let addedReleasesIdsArray = [];
        let addedReleasesArray = [];

        for (let i = 0; i < 4; i++) {
          const res = await fetch(
            `${ENDPOINTS.collection.base}/${collection_id}/releases/${i}?token=${userStore.token}`
          );
          const data = await res.json();

          if (data.content.length > 0) {
            data.content.forEach((release) => {
              if (!addedReleasesIds.includes(release.id)) {
                addedReleasesIdsArray.push(release.id);
                addedReleasesArray.push(release);
              }
            });
          } else {
            setAddedReleases(addedReleasesArray);
            setAddedReleasesIds(addedReleasesIdsArray);
            break;
          }
        }

        if (
          mode === "edit" &&
          userStore.user.id == data.collection.creator.id
        ) {
          setEdit(true);

          setCollectionInfo({
            title: data.collection.title,
            description: data.collection.description,
          });
          setStringLength({
            title: data.collection.title.length,
            description: data.collection.description.length,
          });

          setIsPrivate(data.collection.is_private);
          setImageUrl(data.collection.image);

          setIsSending(false);
        }
      }
    }
    if (userStore.user) {
      _checkMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user]);

  useEffect(() => {
    if (imageModalProps.croppedImage) {
      setImageUrl(imageModalProps.croppedImage);
      setImageModalProps({
        isOpen: false,
        isActionsDisabled: false,
        selectedImage: null,
        croppedImage: null,
      });
    }
  }, [imageModalProps.croppedImage]);

  const handleImagePreview = (e: any) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result;
      setImageModalProps({
        ...imageModalProps,
        isOpen: true,
        selectedImage: content,
      });
      e.target.value = "";
    };
    fileReader.readAsDataURL(file);
  };

  function handleInput(e) {
    const regex = /[^a-zA-Zа-яА-Я0-9_.,:()!? \[\]]/g;
    setCollectionInfo({
      ...collectionInfo,
      [e.target.name]: e.target.value.replace(regex, ""),
    });
    setStringLength({
      ...stringLength,
      [e.target.name]: e.target.value.replace(regex, "").length,
    });
  }

  function submit(e) {
    e.preventDefault();

    async function _createCollection() {
      setIsSending(true);
      const tid = toast.loading(
        mode === "edit" ? "Редактируем коллекцию..." : "Создаём коллекцию...",
        {
          position: "bottom-center",
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          theme: theme.mode == "light" ? "light" : "dark",
        }
      );
      const url =
        mode === "edit" ?
          `${ENDPOINTS.collection.edit}/${collection_id}?token=${userStore.token}`
        : `${ENDPOINTS.collection.create}?token=${userStore.token}`;

      const { data, error } = await tryCatchAPI(
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...collectionInfo,
            is_private: isPrivate,
            private: isPrivate,
            releases: addedReleasesIds,
          }),
        })
      );

      if (error) {
        let message = `${error.message}, code: ${error.code}`;
        if (error.code == 5) {
          message =
            "Вы превысили допустимый еженедельный лимит создания коллекций";
        }
        toast.update(tid, {
          render: message,
          type: "error",
          autoClose: 2500,
          isLoading: false,
          closeOnClick: true,
          draggable: true,
        });
        setIsSending(false);
        return;
      }

      if (imageUrl && !imageUrl.startsWith("http")) {
        let block = imageUrl.split(";");
        let contentType = block[0].split(":")[1];
        let realData = block[1].split(",")[1];
        const blob = b64toBlob(realData, contentType);

        const formData = new FormData();
        formData.append("image", blob, "cropped.jpg");
        formData.append("name", "image");

        const tiid = toast.loading(
          `Обновление обложки коллекции ${collectionInfo.title}...`,
          {
            position: "bottom-center",
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            theme: theme.mode == "light" ? "light" : "dark",
          }
        );

        const { data: imageData, error } = await tryCatchAPI(
          fetch(
            `${ENDPOINTS.collection.editImage}/${data.collection.id}?token=${userStore.token}`,
            {
              method: "POST",
              body: formData,
            }
          )
        );

        if (error) {
          toast.update(tiid, {
            render: "Не удалось обновить постер коллекции",
            type: "error",
            autoClose: 2500,
            isLoading: false,
            closeOnClick: true,
            draggable: true,
          });
        } else {
          toast.update(tiid, {
            render: "Постер коллекции обновлён",
            type: "success",
            autoClose: 2500,
            isLoading: false,
            closeOnClick: true,
            draggable: true,
          });
        }
      }

      toast.update(tid, {
        render:
          mode === "edit" ?
            `Коллекция ${collectionInfo.title} обновлена`
          : `Коллекция ${collectionInfo.title} создана`,
        type: "success",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      router.push(`/collection/${data.collection.id}`);
      setIsSending(false);
    }

    if (collectionInfo.title.length < 10) {
      toast.error("Необходимо ввести название коллекции не менее 10 символов", {
        position: "bottom-center",
        hideProgressBar: true,
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    if (addedReleasesIds.length < 1) {
      toast.error("Необходимо добавить хотя бы один релиз в коллекцию", {
        position: "bottom-center",
        hideProgressBar: true,
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    _createCollection();
  }

  function _deleteRelease(release: any) {
    let releasesArray = [];
    let idsArray = [];

    for (let i = 0; i < addedReleases.length; i++) {
      if (addedReleases[i].id != release.id) {
        releasesArray.push(addedReleases[i]);
        idsArray.push(addedReleasesIds[i]);
      }
    }

    setAddedReleases(releasesArray);
    setAddedReleasesIds(idsArray);
  }

  return (
    <>
      <Card>
        <p className="text-xl font-bold">
          {edit ? "Редактирование коллекции" : "Создание коллекции"}
        </p>
        <form
          className="flex flex-col w-full gap-2 lg:items-center lg:flex-row"
          onSubmit={(e) => submit(e)}
        >
          <Label
            htmlFor="dropzone-file"
            className="flex flex-col items-center w-full sm:max-w-[600px] h-[337px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center max-w-[595px] h-[inherit] rounded-[inherit] pt-5 pb-6 overflow-hidden">
              {
                !imageUrl ?
                  <>
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        Нажмите для загрузки
                      </span>{" "}
                      или перетащите файл
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG или JPG (Макс. 600x337 пикселей)
                    </p>
                  </>
                  // eslint-disable-next-line @next/next/no-img-element
                : <img
                    src={imageUrl}
                    className="object-cover w-[inherit] h-[inherit]"
                    alt=""
                  />

              }
            </div>
            <FileInput
              id="dropzone-file"
              className="hidden"
              accept="image/jpg, image/jpeg, image/png"
              onChange={(e) => {
                handleImagePreview(e);
              }}
            />
          </Label>
          <div className="flex-1">
            <div className="block mb-2">
              <Label htmlFor="title">
                Название (минимум 10, максимум 60 символов)
              </Label>
            </div>
            <TextInput
              id="title"
              name="title"
              type="text"
              sizing="md"
              className="w-full"
              required={true}
              onChange={(e) => handleInput(e)}
              value={collectionInfo.title}
              maxLength={60}
            />
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {stringLength.title}/60
            </p>
            <div className="block mt-2 mb-2">
              <Label htmlFor="description">
                Описание (максимум 1000 символов)
              </Label>
            </div>
            <Textarea
              rows={4}
              id="description"
              className="w-full"
              name="description"
              onChange={(e) => handleInput(e)}
              value={collectionInfo.description}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {stringLength.description}/1000
            </p>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <Checkbox
                  id="private"
                  name="private"
                  color="blue"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <Label htmlFor="private">Приватная коллекция</Label>
              </div>
            </div>
            <Button
              color={"blue"}
              className="mt-4"
              type="submit"
              disabled={isSending}
            >
              {edit ? "Обновить" : "Создать"}
            </Button>
          </div>
        </form>
      </Card>
      <div className="mt-4">
        <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
          <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
            {"Релизов в коллекции: " + addedReleases.length}/100
          </h1>
          <Button
            color={"blue"}
            size={"xs"}
            onClick={() => setReleasesEditModalOpen(!releasesEditModalOpen)}
          >
            Добавить
          </Button>
        </div>
        <div className="m-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {addedReleases.map((release) => {
              return (
                <div key={release.id} className="relative w-full h-full group">
                  <button
                    className="absolute inset-0 z-30 text-black transition-opacity bg-white rounded-lg opacity-0 group-hover:opacity-75"
                    onClick={() => _deleteRelease(release)}
                  >
                    Удалить
                  </button>
                  <PosterWithStuff {...release} />
                </div>
              );
            })}
            {addedReleases.length == 1 && <div></div>}
          </div>
        </div>
      </div>
      <ReleasesEditModal
        isOpen={releasesEditModalOpen}
        setIsOpen={setReleasesEditModalOpen}
        releases={addedReleases}
        releasesIds={addedReleasesIds}
        setReleases={setAddedReleases}
        setReleasesIds={setAddedReleasesIds}
      />
      <CropModal
        {...imageModalProps}
        cropParams={{
          aspectRatio: 600 / 337,
          forceAspect: true,
          guides: true,
          width: 600,
          height: 337,
        }}
        setCropModalProps={setImageModalProps}
      />
    </>
  );
};

export const ReleasesEditModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  releases: any;
  setReleases: any;
  releasesIds: any;
  setReleasesIds: any;
}) => {
  const [query, setQuery] = useState("");

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.releases.length) return null;

    const url = new URL("/api/search", window.location.origin);
    url.searchParams.set("page", pageIndex.toString());
    if (!query) return null;
    url.searchParams.set("q", query);
    return url.toString();
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 2, revalidateFirstPage: false }
  );

  const [content, setContent] = useState([]);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].releases);
      }
      setContent(allReleases);
    }
  }, [data]);

  const [currentRef, setCurrentRef] = useState<any>(null);
  const modalRef = useCallback((ref) => {
    setCurrentRef(ref);
  }, []);

  const [scrollPosition, setScrollPosition] = useState(0);
  function handleScroll() {
    const height = currentRef.scrollHeight - currentRef.clientHeight;
    const windowScroll = currentRef.scrollTop;
    const scrolled = (windowScroll / height) * 100;
    setScrollPosition(Math.floor(scrolled));
  }
  useEffect(() => {
    if (scrollPosition >= 95 && scrollPosition <= 96) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  function _addRelease(release: any) {
    if (props.releasesIds.length == 100) {
      toast.error(
        "Достигнуто максимальное количество релизов в коллекции - 100",
        {
          position: "bottom-center",
          hideProgressBar: true,
          type: "error",
          autoClose: 2500,
          isLoading: false,
          closeOnClick: true,
          draggable: true,
        }
      );
      return;
    }

    if (props.releasesIds.includes(release.id)) {
      toast.error("Релиз уже добавлен в коллекцию", {
        position: "bottom-center",
        hideProgressBar: true,
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    const newContent = content.filter((r) => r.id !== release.id);

    setContent(newContent);
    props.setReleases([...props.releases, release]);
    props.setReleasesIds([...props.releasesIds, release.id]);
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"7xl"}
    >
      <ModalHeader>Изменить релизы в коллекции</ModalHeader>
      <div
        onScroll={handleScroll}
        ref={modalRef}
        className="px-4 py-4 overflow-auto"
      >
        <form
          className="max-w-full mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Поиск
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Поиск аниме..."
              required
              onChange={(e) => setQuery(e.target.value)}
              value={query || ""}
            />
            <button
              type="button"
              className="text-white absolute end-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              onClick={() => {
                setSize(0);
                setContent([]);
                setQuery("");
              }}
            >
              Очистить
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {content.map((release) => {
            return (
              <button
                className="text-left"
                key={release.id}
                onClick={() => _addRelease(release)}
              >
                <PosterWithStuff {...release} />
              </button>
            );
          })}
        </div>
        {isLoading && (
          <div className="flex items-center justify-center h-full min-h-24">
            <Spinner />
          </div>
        )}
        {error && <div>Произошла ошибка</div>}
      </div>
    </Modal>
  );
};
