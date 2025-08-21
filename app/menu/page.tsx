export const metadata = {
  title: "Меню",
};

import { MenuPage } from "#/pages/MobileMenuPage";

export const dynamic = "force-static";

export default function Index() {
  return <MenuPage />;
}
