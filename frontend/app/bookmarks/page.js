"use client";

import { useUserStore } from "@/app/store/user-store";
import { LogInNeeded } from "@/app/components/LogInNeeded/LogInNeeded";
import BookmarksPage from "../components/Pages/BookmarksPage";

export default function Bookmarks() {
  const userStore = useUserStore();

  return <>{!userStore.isAuth ? <LogInNeeded /> : <BookmarksPage />}</>;
}
