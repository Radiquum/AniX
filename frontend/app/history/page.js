"use client";

import { LogInNeeded } from "@/app/components/LogInNeeded/LogInNeeded";
import { useUserStore } from "@/app/store/user-store";

export default History = () => {
  const userStore = useUserStore();

  return <>{!userStore.isAuth ? <LogInNeeded /> : ""}</>;
};
