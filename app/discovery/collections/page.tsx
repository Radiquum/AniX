import { DiscoverCollectionsPage } from "#/pages/DiscoverCollections";

export const metadata = {
  title: "Обзор - Коллекции",
  description: "",
};

export const dynamic = "force-static";

export default function Discover() {
  return <DiscoverCollectionsPage />;
}
