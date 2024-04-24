"use client";
import { useUserStore } from "@/app/store/user-store";
import { UserProfile } from "@/app/components/UserProfile/UserProfile";

export default function Profile() {
  const userStore = useUserStore();

  return (
    <>
      {userStore.user ? (
        <UserProfile profile={userStore.user.profile} />
      ) : (
        <progress></progress>
      )}
    </>
  );
}
