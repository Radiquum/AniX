import { SearchPage } from "#/pages/Search";

export const metadata = {
  title: "Поиск",
  description: "Поиск аниме релизов",
};

export const dynamic = "force-static";

export default function Search() {
  return <SearchPage />;
}
