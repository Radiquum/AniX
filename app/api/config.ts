export const CURRENT_APP_VERSION = "3.7.0";
import { env } from "next-runtime-env";

const NEXT_PUBLIC_API_URL = env("NEXT_PUBLIC_API_URL") || null;
export const API_URL = NEXT_PUBLIC_API_URL ||"https://api.anixart.app";
export const API_PREFIX = NEXT_PUBLIC_API_URL || "/api/proxy";
export const USER_AGENT =
  "AnixartApp/9.0 BETA 5-25062213 (Android 9; SDK 28; arm64-v8a; samsung SM-G975N; en)";

export const ENDPOINTS = {
  release: {
    info: `${API_PREFIX}/release`,
    episode: `${API_PREFIX}/episode`,
    related: `${API_PREFIX}/related`,
    licensed: `${API_PREFIX}/release/streaming/platform`,
  },
  user: {
    auth: `${API_PREFIX}/auth/signIn`,
    profile: `${API_PREFIX}/profile`,
    bookmark: `${API_PREFIX}/profile/list`,
    history: `${API_PREFIX}/history`,
    favorite: `${API_PREFIX}/favorite`,
    blocklist: `${API_PREFIX}/profile/blocklist`,
    friend: {
      list: `${API_PREFIX}/profile/friend/all`,
      add: `${API_PREFIX}/profile/friend/request/send`,
      remove: `${API_PREFIX}/profile/friend/request/remove`,
      hide: `${API_PREFIX}/profile/friend/request/hide`,
      in: `${API_PREFIX}/profile/friend/requests/in`,
      out: `${API_PREFIX}/profile/friend/requests/out`,
    },
    settings: {
      my: `${API_PREFIX}/profile/preference/my`,
      login: {
        info: `${API_PREFIX}/profile/preference/login/info`,
        history: `${API_PREFIX}/profile/login/history/all`, // /<user_id>/<page>
        change: `${API_PREFIX}/profile/preference/login/change`, // ?login=<url_encoded_string>
      },
      status: `${API_PREFIX}/profile/preference/status/edit`,
      avatar: `${API_PREFIX}/profile/preference/avatar/edit`,
      privacy: {
        stats: `${API_PREFIX}/profile/preference/privacy/stats/edit`,
        counts: `${API_PREFIX}/profile/preference/privacy/counts/edit`,
        socials: `${API_PREFIX}/profile/preference/privacy/social/edit`,
        friendRequests: `${API_PREFIX}/profile/preference/privacy/friendRequests/edit`,
      },
      socials: {
        info: `${API_PREFIX}/profile/preference/social`,
        edit: `${API_PREFIX}/profile/preference/social/edit`,
      },
    }
  },
  filter: `${API_PREFIX}/filter`,
  search: `${API_URL}/search`,
  statistic: {
    addHistory: `${API_PREFIX}/history/add`,
    markWatched: `${API_PREFIX}/episode/watch`,
  },
  collection: {
    base: `${API_PREFIX}/collection`,
    addRelease: `${API_PREFIX}/collectionMy/release/add`,
    create: `${API_PREFIX}/collectionMy/create`,
    delete: `${API_PREFIX}/collectionMy/delete`,
    edit: `${API_PREFIX}/collectionMy/edit`,
    editImage: `${API_PREFIX}/collectionMy/editImage`,
    releaseInCollections: `${API_PREFIX}/collection/all/release`,
    userCollections: `${API_PREFIX}/collection/all/profile`,
    favoriteCollections: `${API_PREFIX}/collectionFavorite`,
  }
};
