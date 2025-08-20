"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import {
  Button,
  Dropdown,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useUserStore } from "#/store/auth";

const whereMapping = [
  {
    id: "releases",
    label: "Релизах",
    auth: false,
  },
  {
    id: "profiles",
    label: "Профилях",
    auth: false,
  },
  {
    id: "list",
    label: "Списках",
    auth: true,
  },
  {
    id: "history",
    label: "Истории",
    auth: true,
  },
  {
    id: "favorites",
    label: "Избранном",
    auth: true,
  },
  {
    id: "collections",
    label: "Коллекциях",
    auth: true,
  },
];

const searchByMapping = {
  releases: [
    {
      id: "name",
      label: "Названию",
      value: 0,
    },
    {
      id: "studio",
      label: "Студии",
      value: 1,
    },
    {
      id: "director",
      label: "Режиссёру",
      value: 2,
    },
    {
      id: "author",
      label: "Автору",
      value: 3,
    },
    {
      id: "tag",
      label: "Тегу",
      value: 4,
    },
  ],
  list: [
    {
      id: "watching",
      label: "Смотрю",
      value: 1,
    },
    {
      id: "planned",
      label: "В планах",
      value: 2,
    },
    {
      id: "watched",
      label: "Просмотрено",
      value: 3,
    },
    {
      id: "delayed",
      label: "Отложено",
      value: 4,
    },
    {
      id: "abandoned",
      label: "Заброшено",
      value: 5,
    },
  ],
  none: [{ id: "none", label: "Нет", value: 0 }],
};

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userStore = useUserStore();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [params, setParams] = useState(null);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  useEffect(() => {
    let _parsed = null;
    try {
      _parsed = JSON.parse(searchParams.get("params"));
    } catch {
      _parsed = {
        where: "releases",
        searchBy: "name",
      };
    }
    setParams(_parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!params) return;

    const url = new URL(`/search`, window.location.origin);
    url.searchParams.set("params", JSON.stringify(params));
    router.replace(url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  if (!params) return <></>;

  return (
    <div>
      <div className="flex flex-wrap w-full gap-2">
        <div className="flex flex-1 w-full">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative w-full">
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
              // value={searchVal}
              // onChange={(e) => setSearchVal(e.target.value)}
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Поиск
            </button>
          </div>
        </div>
        <Button
          color="light"
          size="xl"
          className="flex items-center gap-1"
          onClick={() => setFiltersModalOpen(true)}
        >
          <span className="w-6 h-6 iconify material-symbols--filter-list"></span>
          Фильтры
        </Button>
      </div>

      <p>query: {query}</p>
      <p>params: {JSON.stringify(params)}</p>
      <FiltersModal
        isOpen={filtersModalOpen}
        setIsOpen={setFiltersModalOpen}
        isAuth={userStore.isAuth}
        setContent={() => {}}
        params={params}
        setParams={setParams}
      />
    </div>
  );
}

const FiltersModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  isAuth: boolean;
  setContent: any;
  params: any;
  setParams: any;
}) => {
  if (!props.params) return <></>;

  return (
    <Modal show={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <ModalHeader>Фильтры</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div className="flex justify-between gap-4">
            <p>Искать в</p>
            <Dropdown
              label={
                whereMapping.find((item) => item.id == props.params.where).label
              }
              color="blue"
            >
              {whereMapping.map((item) => {
                return item.auth && !props.isAuth ?
                    <></>
                  : <DropdownItem
                      onClick={() =>
                        searchByMapping[item.id] ?
                          props.setParams({
                            where: item.id,
                            searchBy: searchByMapping[item.id][0].id,
                          })
                        : props.setParams({ where: item.id, searchBy: "none" })
                      }
                      key={`where--${item.id}`}
                    >
                      {item.label}
                    </DropdownItem>;
              })}
            </Dropdown>
          </div>
          {searchByMapping[props.params.where] ?
            <div className="flex justify-between gap-4">
              <p>Искать по</p>
              <Dropdown
                label={
                  props.params.searchBy == "none" ?
                    searchByMapping.none[0].label
                  : searchByMapping[props.params.where].find(
                      (item) => item.id == props.params.searchBy
                    ).label
                }
                color="blue"
              >
                {searchByMapping[props.params.where].map((item) => {
                  return (
                    <DropdownItem
                      onClick={() =>
                        props.setParams({
                          where: props.params.where,
                          searchBy: item.id,
                        })
                      }
                      key={`searchBy--${item.id}`}
                    >
                      {item.label}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
          : <></>}
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

// import useSWRInfinite from "swr/infinite";
// import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
// import { RelatedSection } from "#/components/RelatedSection/RelatedSection";
// import { Spinner } from "#/components/Spinner/Spinner";
// import { useScrollPosition } from "#/hooks/useScrollPosition";
// import { useUserStore } from "../store/auth";
// import { Button, Dropdown, DropdownItem, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
// import { CollectionsSection } from "#/components/CollectionsSection/CollectionsSection";
// import { UserSection } from "#/components/UserSection/UserSection";
// import { useSWRfetcher } from "#/api/utils";

// export function SearchPage() {
//   const router = useRouter();

//   const [searchVal, setSearchVal] = useState(searchParams.get("q") || "");
//   const [where, setWhere] = useState(searchParams.get("where") || "releases");

//   const [list, setList] = useState(searchParams.get("list") || "watching");
//   const [filtersModalOpen, setFiltersModalOpen] = useState(false);

//

//   const getKey = (pageIndex: number, previousPageData: any) => {
//     if (where == "releases") {
//       if (previousPageData && !previousPageData.releases.length) return null;
//     } else {
//       if (previousPageData && !previousPageData.content.length) return null;
//     }

//     const url = new URL("/api/search", window.location.origin);
//     url.searchParams.set("page", pageIndex.toString());

//     if (userStore.token) {
//       url.searchParams.set("token", userStore.token);
//     }

//     if (where) {
//       url.searchParams.set("where", where);
//     }

//     if (where == "list" && list && ListsMapping.hasOwnProperty(list)) {
//       url.searchParams.set("list", ListsMapping[list].id);
//     }

//     url.searchParams.set("searchBy", TagMapping[searchBy].id);

//     if (query) {
//       url.searchParams.set("q", query);
//       return url.toString();
//     }
//     return;
//   };

//   const { data, error, isLoading, size, setSize } = useSWRInfinite(
//     getKey,
//     useSWRfetcher,
//     { initialSize: 2, revalidateFirstPage: false }
//   );

//   const [content, setContent] = useState(null);
//   useEffect(() => {
//     if (data) {
//       let allReleases = [];
//       if (where == "releases") {
//         for (let i = 0; i < data.length; i++) {
//           allReleases.push(...data[i].releases);
//         }
//       } else {
//         for (let i = 0; i < data.length; i++) {
//           allReleases.push(...data[i].content);
//         }
//       }
//       setContent(allReleases);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data]);

//   const scrollPosition = useScrollPosition();
//   useEffect(() => {
//     if (scrollPosition >= 98 && scrollPosition <= 99) {
//       setSize(size + 1);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [scrollPosition]);

//   function _executeSearch(value: string) {
//     const Params = new URLSearchParams(window.location.search);
//     Params.set("q", value);
//     const url = new URL(`/search?${Params.toString()}`, window.location.origin);
//     setContent(null);
//     setQuery(value);
//     router.push(url.toString());
//   }

//   useEffect(() => {
//     if (searchVal && searchVal.length % 4 == 1) {
//       _executeSearch(searchVal.trim());
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchVal]);

//   if (error)
//     return (
//       <main className="flex items-center justify-center min-h-screen">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-2xl font-bold">Ошибка</h1>
//           <p className="text-lg">
//             Произошла ошибка поиска. Попробуйте обновить страницу или зайдите
//             позже.
//           </p>
//         </div>
//       </main>
//     );

//   return (
//     <>
//       <div className="flex flex-wrap items-center gap-2">
//         <form
//           className="flex-1 max-w-full mx-auto"
//           onSubmit={(e) => {
//             e.preventDefault();
//             _executeSearch(searchVal.trim());
//           }}
//         >

//         </form>
//         <Button
//           color="light"
//           size="xl"
//           onClick={() => setFiltersModalOpen(true)}
//         >
//           Фильтры
//         </Button>
//       </div>
//       <div className="mt-2">
//         {data && data[0].related && <RelatedSection {...data[0].related} />}
//         {content ?
//           content.length > 0 ?
//             <>
//               {where == "collections" ?
//                 <CollectionsSection
//                   sectionTitle="Найденные Коллекции"
//                   content={content}
//                 />
//               : where == "profiles" ?
//                 <UserSection
//                   sectionTitle="Найденные Пользователи"
//                   content={content}
//                 />
//               : <ReleaseSection
//                   sectionTitle="Найденные релизы"
//                   content={content}
//                 />
//               }
//             </>
//           : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
//               <span className="w-24 h-24 iconify-color twemoji--crying-cat"></span>
//               <p>Странно, аниме не найдено, попробуйте другой запрос...</p>
//             </div>
//         : isLoading && (
//             <div className="flex items-center justify-center min-w-full min-h-screen">
//               <Spinner />
//             </div>
//           )
//         }
//         {!content && !isLoading && !query && (
//           <div className="flex flex-col items-center justify-center min-w-full gap-2 mt-12 text-xl">
//             <span className="w-16 h-16 iconify mdi--arrow-up animate-bounce"></span>
//             <p>Введите ваш запрос что-бы найти любимый тайтл</p>
//           </div>
//         )}
//       </div>
//       {(
//         data &&
//         data.length > 1 &&
//         (where == "releases" ?
//           data[data.length - 1].releases.length == 25
//         : data[data.length - 1].content.length == 25)
//       ) ?
//         <Button
//           className="w-full"
//           color={"light"}
//           onClick={() => setSize(size + 1)}
//         >
//           <div className="flex items-center gap-2">
//             <span className="w-6 h-6 iconify mdi--plus-circle "></span>
//             <span className="text-lg">Загрузить ещё</span>
//           </div>
//         </Button>
//       : ""}
//       <FiltersModal
//         isOpen={filtersModalOpen}
//         setIsOpen={setFiltersModalOpen}
//         where={where}
//         setWhere={setWhere}
//         list={list}
//         setList={setList}
//         isAuth={userStore.isAuth}
//         searchBy={searchBy}
//         setSearchBy={setSearchBy}
//         setContent={setContent}
//       />
//     </>
//   );
// }

// const FiltersModal = (props: {
//   isOpen: boolean;
//   setIsOpen: any;
//   where: string;
//   setWhere: any;
//   list: string;
//   setList: any;
//   isAuth: boolean;
//   searchBy: string;
//   setSearchBy: any;
//   setContent: any;
// }) => {
//   const router = useRouter();
//   const [where, setWhere] = useState(props.where);
//   const [list, setList] = useState(props.list);
//   const [searchBy, setSearchBy] = useState(props.searchBy);

//   function _cancel() {
//     setWhere(props.where);
//     setList(props.list);
//     setSearchBy(props.searchBy);
//     props.setIsOpen(false);
//   }

//   function _accept() {
//     const Params = new URLSearchParams(window.location.search);

//     if (props.where != where) {
//       Params.set("where", where);
//       props.setWhere(where);
//     }

//     if (where == "list") {
//       Params.set("list", list);
//       props.setList(list);
//     } else {
//       Params.delete("list");
//     }

//     if (!["profiles", "collections"].includes(where)) {
//       Params.set("searchBy", searchBy);
//       props.setSearchBy(searchBy);
//     } else {
//       Params.delete("searchBy");
//       props.setSearchBy("name");
//     }

//     props.setContent(null);

//     const url = new URL(`/search?${Params.toString()}`, window.location.origin);
//     router.push(url.toString());
//   }

//   return (
//     <Modal show={props.isOpen} onClose={() => _cancel()}>
//       <ModalHeader>Фильтры</ModalHeader>
//       <ModalBody>
//         <div className="my-4">
//           <div className="flex items-center justify-between">
//             <p className="font-bold dark:text-white">Искать в</p>
//             <Dropdown label={WhereMapping[where]} color="blue">
//               {Object.keys(WhereMapping).map((item) => {
//                 if (
//                   ["list", "history", "collections", "favorites"].includes(
//                     item
//                   ) &&
//                   !props.isAuth
//                 ) {
//                   return <></>;
//                 } else {
//                   return (
//                     <DropdownItem
//                       onClick={() => setWhere(item)}
//                       key={`where--${item}`}
//                     >
//                       {WhereMapping[item]}
//                     </DropdownItem>
//                   );
//                 }
//               })}
//             </Dropdown>
//           </div>
//         </div>
//         {props.isAuth && where == "list" && ListsMapping.hasOwnProperty(list) ?
//           <div className="my-4">
//             <div className="flex items-center justify-between">
//               <p className="font-bold dark:text-white">Список</p>
//               <Dropdown label={ListsMapping[list].name} color="blue">
//                 {Object.keys(ListsMapping).map((item) => {
//                   return (
//                     <DropdownItem
//                       onClick={() => setList(item)}
//                       key={`list--${item}`}
//                     >
//                       {ListsMapping[item].name}
//                     </DropdownItem>
//                   );
//                 })}
//               </Dropdown>
//             </div>
//           </div>
//         : ""}
//         {!["profiles", "collections"].includes(where) ?
//           <div className="my-4">
//             <div className="flex items-center justify-between">
//               <p className="font-bold dark:text-white">Искать по</p>
//               <Dropdown label={TagMapping[searchBy].name} color="blue">
//                 {Object.keys(TagMapping).map((item) => {
//                   return (
//                     <DropdownItem
//                       onClick={() => setSearchBy(item)}
//                       key={`tag--${item}`}
//                     >
//                       {TagMapping[item].name}
//                     </DropdownItem>
//                   );
//                 })}
//               </Dropdown>
//             </div>
//           </div>
//         : ""}
//       </ModalBody>
//       <ModalFooter>
//         <div className="flex justify-end w-full gap-2">
//           <Button color="red" onClick={() => _cancel()}>
//             Отменить
//           </Button>
//           <Button color="blue" onClick={() => _accept()}>
//             Применить
//           </Button>
//         </div>
//       </ModalFooter>
//     </Modal>
//   );
// };
