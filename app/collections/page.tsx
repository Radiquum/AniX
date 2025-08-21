import { CollectionsPage } from "#/pages/Collections";

export const metadata = {
  title: "Коллекции",
  description: "Просмотр и управление коллекциями",
}

export const dynamic = "force-static";

export default function Collections() {
  return <CollectionsPage />;
}
