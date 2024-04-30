"use client";

import { ReleasePlayer } from "@/app/components/Release/ReleasePlayer";
import { ReleaseInfo } from "@/app/components/Release/ReleaseInfo";

export default function Release(props) {
  return (
    <>
      <ReleasePlayer id={props.params.id} />
      <span style={{ marginBlock: "2rem" }}></span>
      <ReleaseInfo id={props.params.id} />
    </>
  );
}
