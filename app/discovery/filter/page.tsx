import { DiscoverFilterPage } from "#/pages/DiscoverFilter";

export const metadata = {
  title: "Фильтр",
  description: "Поиск по фильтру",
};

export const dynamic = "force-static";

export default function Discover() {
  return <DiscoverFilterPage />;
}
