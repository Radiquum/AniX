"use client";
import { UserProfile } from "@/app/components/UserProfile/UserProfile";
import { endpoints } from "@/app/api/config";
import { getData } from "@/app/api/api-utils";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

export default function Profile(props) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function _getProfile() {
      const _profile = await getData(
        `${endpoints.user.profile}/${props.params.id}`,
      );
      setProfile(_profile);
    }
    _getProfile();
  }, [props.params.id]);

  return (
    <>
      {profile ? (
        profile.profile ? (
          <UserProfile profile={profile.profile} />
        ) : (
          notFound()
        )
      ) : (
        <progress></progress>
      )}
    </>
  );
}
