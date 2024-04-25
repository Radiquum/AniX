"use client";

import { useUserStore } from "../store/user-store";
import { endpoints } from "../api/config";
import { authorize, isResponseOk } from "../api/api-utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const userStore = useUserStore();
  const router = useRouter();
  const [authData, setAuthData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (userStore.isAuth) {
      router.push("/profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = await authorize(endpoints.user.auth, authData);
    if (isResponseOk(userData)) {
      userStore.login(
        userData,
        userData.profileToken.token,
        userData.profile.id,
      );
    }
  };

  useEffect(() => {
    let timer;
    if (userStore.user) {
      timer = setTimeout(() => {
        router.push("/profile");
      }, 1000);
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user]);

  return (
    <div className="absolute padding secondary-container center middle round">
      <i className="extra">login</i>
      <h5>Вход в аккаунт anixart.</h5>
      <form onSubmit={handleSubmit}>
        <div className="border field fill label large round">
          <input type="email" name="email" onInput={handleInput} />
          <label>логин</label>
        </div>
        <div className="border field fill label large round">
          <input type="password" name="password" onInput={handleInput} />
          <label>пароль</label>
        </div>
        <button className="small-round medium" type="submit">
          <i>login</i>
          <span>Войти</span>
        </button>
      </form>
    </div>
  );
}
