import { DiscoverPage } from "#/pages/Discover";

export const metadata = {
  title: "Обзор",
  description: "Рекомендации и популярное",
};

export const dynamic = "force-static";

export default function Discover() {
  return <DiscoverPage />;
}
