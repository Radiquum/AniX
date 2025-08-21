export const metadata = {
  title: "Избранное",
};

import { FavoritesPage } from "#/pages/Favorites";

export const dynamic = "force-static";

export default function Index() {
  return <FavoritesPage />;
}
