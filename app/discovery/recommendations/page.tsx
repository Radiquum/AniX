import { DiscoverRecommendationsPage } from "#/pages/DiscoverRecommendations";

export const metadata = {
  title: "Обзор - Рекомендации",
  description: "",
};

export const dynamic = "force-static";

export default function Discover() {
  return <DiscoverRecommendationsPage />;
}
