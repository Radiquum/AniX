import { CollectionsFullPage } from "#/pages/CollectionsFull";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { API_URL } from "#/api/config";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const { data, error } = await fetchDataViaGet(
    `${API_URL}/release/${id}`
  );
  const previousOG = (await parent).openGraph;

  if (error) {
    return {
      title: "Ошибка",
      description: "Ошибка",
    };
  }

  return {
    title: data.release.title_ru + " - в коллекциях",
    description: data.release.description,
    openGraph: {
      ...previousOG,
      images: [
        {
          url: data.release.image, // Must be an absolute URL
          width: 600,
          height: 800,
        },
      ],
    },
  };
}

export default async function Collections({ params }) {
  const { data, error } = await fetchDataViaGet(
    `${API_URL}/release/${params.id}`
  );

  if (error) {
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Ошибка</h1>
        <p className="text-lg">
          Произошла ошибка при загрузке коллекций. Попробуйте обновить страницу
          или зайдите позже.
        </p>
      </div>
    </main>;
  };

  return (
    <CollectionsFullPage
      type="release"
      title={data.release.title_ru + " в коллекциях"}
      release_id={params.id}
    />
  );
}
