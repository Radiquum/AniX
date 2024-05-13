"use client";

import dynamic from "next/dynamic";

const IndexPage = dynamic(() => import("./components/Pages/IndexPage"), {
  ssr: false,
});
export default function Home() {
  return (
    <>
      <IndexPage />
    </>
  );
}
