export const metadata = {
  title: "История",
};

import { HistoryPage } from "#/pages/History";

export const dynamic = "force-static";

export default function Index() {
  return <HistoryPage />;
}
