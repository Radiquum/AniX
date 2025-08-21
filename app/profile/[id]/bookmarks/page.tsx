import { BookmarksPage } from "#/pages/Bookmarks";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { API_URL } from "#/api/config";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id: string = params.id;
  const { data, error } = await fetchDataViaGet(
    `${API_URL}/profile/${id}`
  );
  const previousOG = (await parent).openGraph;

  if (error) {
    return {
      title: "Ошибка",
      description: "Ошибка",
    };
  };

  return {
    title: "Закладки Пользователя - " + data.profile.login,
    description: "Закладки Пользователя - " + data.profile.login,
    openGraph: {
      ...previousOG,
      images: [
        {
          url: data.profile.avatar, // Must be an absolute URL
          width: 600,
          height: 600,
        },
      ],
    },
  };
}

export default function Index({ params }) {
  return <BookmarksPage profile_id={params.id} />;
}
