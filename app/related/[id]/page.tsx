import { RelatedPage } from "#/pages/Related";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { API_URL } from "#/api/config";

const _getData = async (url: string) => {
  const { data, error } = await fetchDataViaGet(url);
  return [data, error];
}

export async function generateMetadata({ params }, parent: ResolvingMetadata): Promise<Metadata> {
  const id:string = params.id;
  const previousOG = (await parent).openGraph;

  const [ related, relatedError ] = await _getData(`${API_URL}/related/${id}/0`);
  if (relatedError || related.content.length == 0) {
    return {
      title: "Ошибка",
      description: "Ошибка",
    };
  };

  const [ firstRelease, firstReleaseError ] = await _getData(`${API_URL}/release/${related.content[0].id}`);
  if (firstReleaseError) {
    return {
      title: "Ошибка",
      description: "Ошибка",
    };
  };

  return {
    title: "Франшиза - " + firstRelease.release.related.name_ru || firstRelease.release.related.name,
    description: firstRelease.release.description,
    openGraph: {
      ...previousOG,
      images: [
        {
          url: firstRelease.release.image, // Must be an absolute URL
          width: 600,
          height: 800,
        },
      ],
    },
  };
}

export default async function Related({ params }) {
  const id: string = params.id;
  const [ related, relatedError ] = await _getData(`${API_URL}/related/${id}/0`);
  if (relatedError || related.content.length == 0) {
    return <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Ошибка</h1>
        <p className="text-lg">Произошла ошибка при загрузке франшизы. Попробуйте обновить страницу или зайдите позже.</p>
      </div>
    </main>
  };

  const [ firstRelease, firstReleaseError ] = await _getData(`${API_URL}/release/${related.content[0].id}`);
  if (firstReleaseError) {
    return <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Ошибка</h1>
        <p className="text-lg">Произошла ошибка при загрузке франшизы. Попробуйте обновить страницу или зайдите позже.</p>
      </div>
    </main>
  };

  return <RelatedPage id={id} title={firstRelease.release.related.name_ru || firstRelease.release.related.name} />;
}
