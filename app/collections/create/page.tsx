import { CreateCollectionPage } from "#/pages/CreateCollection";

export const metadata = {
  title: "Создание коллекции",
  description: "Создание новой коллекции",
};

export const dynamic = "force-static";

export default function Collections() {
  return <CreateCollectionPage />;
}
