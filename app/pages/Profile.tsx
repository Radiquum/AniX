"use client";
import { useUserStore } from "#/store/auth";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner/Spinner";
import { ENDPOINTS } from "#/api/config";
import useSWR from "swr";
import { useSWRfetcher } from "#/api/utils";

import { ProfileUser } from "#/components/Profile/Profile.User";
import { ProfileBannedBanner } from "#/components/Profile/ProfileBannedBanner";
import { ProfilePrivacyBanner } from "#/components/Profile/Profile.PrivacyBanner";
import { ProfileActivity } from "#/components/Profile/Profile.Activity";
import { ProfileStats } from "#/components/Profile/Profile.Stats";
import { ProfileWatchDynamic } from "#/components/Profile/Profile.WatchDynamic";
import { ProfileActions } from "#/components/Profile/Profile.Actions";
import { ProfileReleaseRatings } from "#/components/Profile/Profile.ReleaseRatings";
import { ProfileReleaseHistory } from "#/components/Profile/Profile.ReleaseHistory";
import { ProfileEditModal } from "#/components/Profile/Profile.EditModal";
import { ShareButton } from "#/components/FloatingToolbar/ShareButton";
import { FloatingToolbar } from "#/components/FloatingToolbar/FloatingToolbar";

export const ProfilePage = (props: any) => {
  const authUser = useUserStore();
  const [user, setUser] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  let url = `${ENDPOINTS.user.profile}/${props.id}`;
  if (authUser.token) {
    url += `?token=${authUser.token}`;
  }
  const { data, error } = useSWR(url, useSWRfetcher);

  useEffect(() => {
    if (data) {
      setUser(data.profile);
      setIsMyProfile(data.is_my_profile);
    }
  }, [data]);

  if (!user && !error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ошибка</h1>
          <p className="text-lg">
            Произошла ошибка при загрузке профиля. Попробуйте обновить страницу
            или зайдите позже.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <ProfileBannedBanner
          is_banned={user.is_banned}
          is_perm_banned={user.is_perm_banned}
          ban_reason={user.ban_reason}
          ban_expires={user.ban_expires}
        />
        <ProfilePrivacyBanner
          is_privacy={
            user.is_stats_hidden ||
            user.is_counts_hidden ||
            user.is_social_hidden
          }
          is_me_blocked={user.is_me_blocked}
        />
      </div>
      <div
        className={`grid grid-cols-1 gap-2 lg:grid-cols-2 ${
          (
            user.is_banned ||
            user.is_perm_banned ||
            user.is_stats_hidden ||
            user.is_counts_hidden ||
            user.is_social_hidden
          ) ?
            "mt-4"
          : ""
        } mb-4`}
      >
        <div className="flex flex-col gap-2">
          <ProfileUser
            avatar={user.avatar || ""}
            login={user.login || ""}
            status={user.status || ""}
            roles={user.roles || []}
            rating={user.rating_score || 0}
            isMyProfile={isMyProfile || false}
            isVerified={user.is_verified || false}
            isOnline={user.is_online || false}
            isSponsor={user.is_sponsor || false}
            isBlocked={user.is_blocked || false}
            socials={{
              vk: user.vk_page || null,
              tg: user.tg_page || null,
              tt: user.tt_page || null,
              inst: user.inst_page || null,
              discord: user.discord_page || null,
            }}
            is_social_hidden={user.is_social_hidden}
          />
          {authUser.token && (
            <ProfileActions
              isMyProfile={isMyProfile}
              profile_id={user.id}
              isFriendRequestsDisallowed={user.is_friend_requests_disallowed}
              friendStatus={user.friend_status}
              my_profile_id={authUser.user.id}
              token={authUser.token}
              is_me_blocked={user.is_me_blocked}
              is_blocked={user.is_blocked}
              edit_isOpen={isOpen}
              edit_setIsOpen={setIsOpen}
            />
          )}
          {!user.is_counts_hidden && (
            <ProfileActivity
              profile_id={user.id}
              commentCount={user.comment_count}
              commentPreview={user.release_comments_preview || []}
              collectionCount={user.collection_count}
              collectionPreview={user.collections_preview || []}
              friendsCount={user.friend_count}
              friendsPreview={user.friends_preview || []}
              token={authUser.token}
              isMyProfile={isMyProfile || false}
            />
          )}
          {!user.is_stats_hidden && (
            <div className="flex-col hidden gap-2 lg:flex">
              {user.votes && user.votes.length > 0 && (
                <ProfileReleaseRatings
                  ratings={user.votes}
                  token={authUser.token}
                  profile_id={user.id}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!user.is_stats_hidden && (
            <>
              <ProfileStats
                lists={[
                  user.watching_count,
                  user.plan_count,
                  user.completed_count,
                  user.hold_on_count,
                  user.dropped_count,
                ]}
                watched_count={user.watched_episode_count}
                watched_time={user.watched_time}
                profile_id={user.id}
                preferred_genres={user.preferred_genres || []}
                preferred_audiences={user.preferred_audiences || []}
                preferred_themes={user.preferred_themes || []}
              />
              <ProfileWatchDynamic watchDynamic={user.watch_dynamics || []} />
              <div className="flex flex-col gap-2 lg:hidden">
                {user.votes && user.votes.length > 0 && (
                  <ProfileReleaseRatings
                    ratings={user.votes}
                    token={authUser.token}
                    profile_id={user.id}
                  />
                )}
              </div>
              {user.history && user.history.length > 0 && (
                <ProfileReleaseHistory history={user.history} />
              )}
            </>
          )}
        </div>
      </div>
      <ProfileEditModal
        isOpen={isOpen && isMyProfile}
        setIsOpen={setIsOpen}
        token={authUser.token}
        profile_id={user.id}
      />
      <FloatingToolbar>
        <ShareButton text={`Профиль '${user.login}' на Anixart`} />
      </FloatingToolbar>
    </>
  );
};
