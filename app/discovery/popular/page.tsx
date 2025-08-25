import { DiscoverPage } from "#/pages/Discover";

export const metadata = {
  title: "Обзор - Популярное",
  description: "Популярные релизы",
};

export const dynamic = "force-static";

export default function Discover() {
  return <DiscoverPage />;
}
