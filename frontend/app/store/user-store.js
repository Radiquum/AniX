"use client";
import { create } from "zustand";
import { getJWT, setJWT, removeJWT, getMe } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";

export const useUserStore = create((set, get) => ({
  isAuth: false,
  user: null,
  token: null,
  login: (user, token) => {
    set({ isAuth: true, user, token });
    setJWT(token);
  },
  logout: () => {
    set({ isAuth: false, user: null, token: null });
    removeJWT();
  },
  checkAuth: async (user_id) => {
    const jwt = getJWT();
    if (jwt) {
      const me = await getMe(`${endpoints.profile}/${user_id}`, jwt);
      if (me.is_my_profile) {
        get().login(me, jwt);
      } else {
        get().logout();
      }
    } else {
      get().logout();
    }
  },
}));