import "./globals.css";
import "beercss";
import "material-dynamic-colors";

import { NavigationRail } from "@/components/NavigationRail";

export const metadata = {
  title: "AniX",
  description: "Unofficial web app for anixart",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavigationRail />
        <main className="responsive">{children}</main>
      </body>
    </html>
  );
}
