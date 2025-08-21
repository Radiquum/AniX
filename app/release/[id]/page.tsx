import { ReleasePage } from "#/pages/Release";
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
    title: data.release.title_ru,
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

export default async function Search({ params }) {
  const id = params.id;
  return <ReleasePage id={id} />;
}
