"use client";
import { create } from "zustand";
import { getJWT, setJWT, removeJWT, getMe } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";

export const useUserStore = create((set, get) => ({
  isAuth: false,
  user: null,
  token: null,

  login: (user, token, user_id) => {
    set({ isAuth: true, user, token });
    setJWT(token, user_id);
  },
  logout: () => {
    set({ isAuth: false, user: null, token: null });
    removeJWT();
  },
  checkAuth: async () => {
    const jwt = getJWT();
    if (jwt) {
      const me = await getMe(
        `${endpoints.user.profile}/${jwt.user_id}`,
        jwt.jwt,
      );
      get().login(me, jwt.jwt, jwt.user_id);
    } else {
      get().logout();
    }
  },
}));
