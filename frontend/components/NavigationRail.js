"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavigationRail = () => {
  const pathname = usePathname();
  return (
    <nav className="left">
      <button className="circle transparent ">
        <img className="responsive" src="/favicon.ico"></img>
      </button>

      <Link href="/" className={pathname == "/" ? "active" : ""}>
        <i>home</i>
        <div>Home</div>
      </Link>
      <Link href="/favorites" className={pathname == "/favorites" ? "active" : ""}>
        <i>favorite</i>
        <div>Favorites</div>
      </Link>
      <Link href="/search" className={pathname == "/search" ? "active" : ""}>
        <i>search</i>
        <div>Search</div>
      </Link>
      <Link href="/history" className={pathname == "/history" ? "active" : ""}>
        <i>history</i>
        <div>History</div>
      </Link>
      {/* <a>
        <i>share</i>
        <div>share</div>
      </a> */}
    </nav>
  );
};
