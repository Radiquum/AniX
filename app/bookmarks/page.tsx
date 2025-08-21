export const metadata = {
  title: "Закладки",
};

export const dynamic = "force-static";

import { BookmarksPage } from "#/pages/Bookmarks";
export default function Index() {
  return <BookmarksPage />;
}
