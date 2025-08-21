import { CollectionsFullPage } from "#/pages/CollectionsFull";

export const metadata = {
  title: "Избранные коллекции",
  description: "Просмотр избранных коллекций",
};

export const dynamic = "force-static";

export default function Collections() {
  return <CollectionsFullPage type="favorites" title="Избранные коллекции" />;
}
