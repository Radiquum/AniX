import { ViewCollectionPage } from "#/pages/ViewCollection";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { API_URL } from "#/api/config";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const { data, error } = await fetchDataViaGet(
    `${API_URL}/collection/${id}`
  );
  const previousOG = (await parent).openGraph;

  if (error) {
    return {
      title: "Приватная коллекция",
      description: "Приватная коллекция",
    };
  }

  return {
    title:
      data.collection ?
        "коллекция - " + data.collection.title
      : "Приватная коллекция",
    description: data.collection && data.collection.description,
    openGraph: {
      ...previousOG,
      url: `${process.env.METADATA_BASE_URL || "https://example.com"}/collection/${id}`,
      images: [
        {
          url: data.collection && data.collection.image, // Must be an absolute URL
          width: 600,
          height: 800,
        },
      ],
    },
  };
}

export default async function Collections({ params }) {
  return <ViewCollectionPage id={params.id} />;
}
