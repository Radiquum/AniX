"use client";

import { LogInNeeded } from "@/app/components/LogInNeeded/LogInNeeded";
import ReleasesOverview from "../components/ReleasesOverview/ReleasesOverview";
import { useUserStore } from "@/app/store/user-store";
import { endpoints } from "../api/config";
import { useEffect, useState } from "react";
import { getData } from "../api/api-utils";

export default function History() {
  const userStore = useUserStore();

  const [releases, setReleases] = useState();
  const [page, setPage] = useState(0);

  const [isNextPage, setIsNextPage] = useState(true);

  async function fetchData(page = 0) {
    if (userStore.token) {
      const url = `${endpoints.user.bookmarks.history}?page=${page}&token=${userStore.token}`;
      const data = await getData(url);

      if (data.content.length < 25) {
        setIsNextPage(false);
      } else {
        setIsNextPage(true);
      }

      // Handle initial load (page 0) or subsequent pagination
      if (page === 0) {
        setReleases(data.content);
      } else {
        setReleases([...releases, ...data.content]);
      }
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore]);

  useEffect(() => {
    if (releases) {
      fetchData(page); // Use fetchData for pagination
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      {!userStore.isAuth ? (
        <LogInNeeded />
      ) : (
        <ReleasesOverview
          page={page}
          setPage={setPage}
          releases={releases}
          isNextPage={isNextPage}
        />
      )}
    </>
  );
}
