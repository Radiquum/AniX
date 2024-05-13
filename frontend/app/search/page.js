import dynamic from "next/dynamic";

const SearchPage = dynamic(() => import("../components/Pages/SearchPage"), {
  ssr: false,
});

export default function Search() {
  return (
    <>
      <SearchPage />
    </>
  );
}
