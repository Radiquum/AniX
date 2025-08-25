"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "../store/auth";
import { useRouter } from "next/navigation";

export const DiscoverPage = () => {
  const token = useUserStore((state) => state.token);
  const authState = useUserStore((state) => state.state);
  const router = useRouter();

  useEffect(() => {
    if (authState === "finished" && !token) {
      router.push("/login?redirect=/discover");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, token]);

  return <></>;
};
