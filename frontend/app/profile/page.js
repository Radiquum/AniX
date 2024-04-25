"use client";
import { useUserStore } from "@/app/store/user-store";
import { UserProfile } from "@/app/components/UserProfile/UserProfile";
import { LogInNeeded } from "../components/LogInNeeded/LogInNeeded";

export default function Profile() {
  const userStore = useUserStore();

  return (
    <>
      {userStore.isAuth ? (
        userStore.user ? (
          <UserProfile profile={userStore.user.profile} />
        ) : (
          <progress></progress>
        )
      ) : (
        <LogInNeeded />
      )}
    </>
  );
}
