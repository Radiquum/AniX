import { DiscoverWatchingPage } from "#/pages/DiscoverWatching";

export const metadata = {
  title: "Обзор - Смотрят сейчас",
  description: "Релизы которые сейчас смотрят",
};

export const dynamic = "force-static";

export default function Discover() {
  return <DiscoverWatchingPage />;
}
